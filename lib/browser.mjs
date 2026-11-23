import { projectPaths } from './config.mjs';

export const BROWSER_MODES = {
  normal: [],
  light: [{ name: 'prefers-color-scheme', value: 'light' }],
  dark: [{ name: 'prefers-color-scheme', value: 'dark' }],
  'forced-light': [
    { name: 'forced-colors', value: 'active' },
    { name: 'prefers-color-scheme', value: 'light' },
  ],
  'forced-dark': [
    { name: 'forced-colors', value: 'active' },
    { name: 'prefers-color-scheme', value: 'dark' },
  ],
  'reduced-motion': [{ name: 'prefers-reduced-motion', value: 'reduce' }],
};

export function observePreferences() {
  return {
    forcedColors: matchMedia('(forced-colors: active)').matches,
    dark: matchMedia('(prefers-color-scheme: dark)').matches,
    reducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches,
  };
}

export class ControlledBrowser {
  constructor(root, config) {
    this.root = root;
    this.config = config;
    this.context = null;
    this.page = null;
    this.mode = 'normal';
    this.lastError = null;
    this.sessions = new Map();
    this.busy = Promise.resolve();
    this.origins = {
      before: `http://before.localhost:${config.ports.before}`,
      after: `http://after.localhost:${config.ports.after}`,
    };
  }

  serialize(action) {
    const result = this.busy.then(action);
    this.busy = result.catch(() => {});
    return result;
  }

  async start() {
    if (this.page && !this.page.isClosed()) {
      await this.page.bringToFront();
      return this.status();
    }
    let chromium;
    try { ({ chromium } = await import('@playwright/test')); }
    catch { throw new Error('Install the starter kit dependencies: pnpm install, then pnpm exec playwright install chromium'); }
    const origins = Object.values(this.origins);
    const { profile } = projectPaths(this.root);
    this.context = await chromium.launchPersistentContext(profile, {
      headless: process.env.DIFF_HEADLESS === '1',
      viewport: { width: 1500, height: 1000 },
      args: ['--site-per-process', `--isolate-origins=${origins.join(',')}`, '--host-resolver-rules=MAP before.localhost 127.0.0.1, MAP after.localhost 127.0.0.1'],
    });
    this.page = this.context.pages()[0] || await this.context.newPage();
    this.page.on('framenavigated', frame => {
      if (frame === this.page?.mainFrame()) return;
      this.serialize(async () => {
        await this.reconcile();
      }).catch(e => { this.lastError = e.message; });
    });
    this.page.on('close', () => {
      this.sessions.clear();
      this.page = null;
      const context = this.context;
      this.context = null;
      context?.close().catch(() => {});
    });
    await this.page.goto(`http://localhost:${this.config.ports.viewer}/?controlled=1`);
    // The viewer fetches its configuration asynchronously and then assigns iframe src.
    // Wait for both real preview frames before requesting CDP sessions.
    for (let attempt = 0; attempt < 60; attempt++) {
      try { await this.frames(); break; }
      catch (e) {
        if (attempt === 59) throw e;
        await new Promise(resolve => setTimeout(resolve, 250));
      }
    }
    await this.serialize(() => this.reconcile());
    return this.status();
  }

  async frames() {
    if (!this.page || this.page.isClosed()) throw new Error('Controlled browser not running');
    const result = [];
    for (const side of ['before', 'after']) {
      const element = await this.page.$(`#${side}`);
      const frame = element ? await element.contentFrame() : null;
      await element?.dispose();
      if (!frame || !frame.url().startsWith(this.origins[side] + '/')) {
        throw new Error(`${side} preview not ready at ${this.origins[side]}. Check both Vite+ servers and reload the viewer.`);
      }
      result.push({ side, frame });
    }
    return result;
  }

  async reconcile() {
    const frames = await this.frames();
    const active = new Set(frames.map(f => f.frame));
    for (const [frame, session] of this.sessions) {
      if (!active.has(frame)) {
        this.sessions.delete(frame);
        await session.detach().catch(() => {});
      }
    }
    for (const { frame } of frames) {
      if (!this.sessions.has(frame)) {
        let session;
        try { session = await this.context.newCDPSession(frame); }
        catch {
          throw new Error('Per-frame emulation requires isolated Chromium frame targets. Use before.localhost and after.localhost in the controlled browser. No window-wide fallback is allowed.');
        }
        this.sessions.set(frame, session);
      }
      await this.sessions.get(frame).send('Emulation.setEmulatedMedia', { features: BROWSER_MODES[this.mode] });
    }
    return frames;
  }

  async setMode(mode) {
    if (!Object.hasOwn(BROWSER_MODES, mode)) throw new Error(`Unsupported mode: ${mode}`);
    return this.serialize(async () => {
      const frames = await this.reconcile();
      const beforeMode = this.mode;
      const all = frames.map(({ frame }) => this.sessions.get(frame));
      const results = await Promise.allSettled(all.map(session => session.send('Emulation.setEmulatedMedia', { features: BROWSER_MODES[mode] })));
      const failed = results.find(r => r.status === 'rejected');
      if (failed) {
        await Promise.allSettled(all.map(session => session.send('Emulation.setEmulatedMedia', { features: BROWSER_MODES[beforeMode] })));
        throw new Error(`Unable to change both frames: ${failed.reason?.message || failed.reason}`);
      }
      this.mode = mode;
      const observed = Object.fromEntries(await Promise.all(frames.map(async ({ side, frame }) => [side, await frame.evaluate(observePreferences)])));
      if (mode.startsWith('forced-') && (!observed.before.forcedColors || !observed.after.forcedColors)) {
        throw new Error('Forced colours requested but not observed in both frames');
      }
      this.lastError = null;
      return { mode: this.mode, observed };
    });
  }

  async status() {
    const open = !!this.page && !this.page.isClosed();
    const status = { open, mode: this.mode, error: this.lastError, observed: null };
    if (open) {
      try {
        const frames = await this.frames();
        status.observed = Object.fromEntries(await Promise.all(frames.map(async ({ side, frame }) => [side, await frame.evaluate(observePreferences)])));
      } catch (e) { status.error = e.message; }
    }
    return status;
  }

  async stop() {
    if (this.context) await this.context.close().catch(() => {});
    this.context = null;
    this.page = null;
    this.sessions.clear();
  }
}
