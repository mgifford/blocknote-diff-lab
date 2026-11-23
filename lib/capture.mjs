import fs from 'node:fs';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { worktreeStatus } from './git.mjs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { isServing } from './server.mjs';
import { readState } from './config.mjs';

const CONDITIONS = [
  { id: 'light', colorScheme: 'light', forcedColors: 'none', width: 1280, height: 840 },
  { id: 'dark', colorScheme: 'dark', forcedColors: 'none', width: 1280, height: 840 },
  { id: 'forced-light', colorScheme: 'light', forcedColors: 'active', width: 1280, height: 840 },
  { id: 'forced-dark', colorScheme: 'dark', forcedColors: 'active', width: 1280, height: 840 },
  { id: 'reflow-320', colorScheme: 'light', forcedColors: 'none', width: 320, height: 800 },
];

const NOTE = 'The diff captures tracked changes relative to the pinned source SHA; untracked files are listed by git status but are not included. axe findings and the keyboard scenario are partial evidence, not an accessibility conformance determination. Forced-colours emulation does not replace testing a native Windows contrast theme.';

async function axeForPage(page) {
  try {
    const axePath = fileURLToPath(import.meta.resolve('axe-core/axe.min.js'));
    await page.addScriptTag({ path: axePath });
    return await page.evaluate(async () => {
      const results = await window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] } });
      return {
        violations: results.violations.map(v => ({ id: v.id, impact: v.impact, description: v.description, count: v.nodes.length, selectors: v.nodes.slice(0, 5).map(n => n.target) })),
        incomplete: results.incomplete.length,
        passes: results.passes.length,
      };
    });
  } catch (e) {
    return { error: `axe scan unavailable: ${e.message}` };
  }
}

async function scenarioOnPage(page) {
  const editor = page.locator('[contenteditable="true"]').first();
  await editor.waitFor({ state: 'visible', timeout: 20000 });
  await editor.click();
  await page.keyboard.type(' Diff Lab keyboard scenario.');
  const text = await editor.innerText();
  const focused = await page.evaluate(() => {
    const e = document.activeElement;
    return { tag: e?.tagName || '', role: e?.getAttribute('role') || '', label: e?.getAttribute('aria-label') || '' };
  });
  return { insertedTextObserved: text.includes('Diff Lab keyboard scenario.'), focused };
}

export async function capture(root, config) {
  const timestamp = new Date().toISOString();
  const stamp = timestamp.replace(/[:.]/g, '-');
  const reportsDir = path.join(root, 'reports');
  const folder = path.join(reportsDir, stamp);
  const latestFile = path.join(reportsDir, 'latest.json');
  const comparison = { id: config.comparison.id, title: config.comparison.title, issueUrl: config.comparison.issueUrl, description: config.comparison.description };
  const runs = [];
  let state = null;
  let source = { unprepared: true };
  let demoFixtures = false;
  let folderCreated = false;

  const writeJson = (file, data) => fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n');

  const writeFailure = error => {
    const failure = {
      available: true,
      failed: true,
      timestamp,
      comparison,
      source: { ...source, demoFixtures },
      note: 'Capture aborted before a complete report was produced. Do not cite this output as evidence.',
      error: error instanceof Error ? error.message : String(error),
      runs,
    };
    fs.mkdirSync(reportsDir, { recursive: true });
    if (folderCreated && fs.existsSync(folder)) {
      if (fs.readdirSync(folder).length === 0) fs.rmSync(folder, { recursive: true, force: true });
      else writeJson(path.join(folder, 'report.json'), failure);
    }
    writeJson(latestFile, failure);
  };

  try {
    for (const side of ['before', 'after']) {
      if (!await isServing(config.ports[side])) throw new Error(`${side} server is not running. Start the live editors with pnpm start (or the synthetic fixtures with pnpm demo) first.`);
    }
    state = readState(root);
    if (state) {
      source = {
        sha: state.sha,
        upstreamSha: state.upstreamSha || state.sha,
        fixture: state.fixture || null,
        patchHash: state.patchHash,
        patched: state.patched,
        diffBase: state.sha,
        currentDiff: null,
        beforeChanges: '',
        afterChanges: '',
      };
    }
    let chromium;
    try { ({ chromium } = await import('@playwright/test')); }
    catch { throw new Error('Run pnpm install in the starter kit and pnpm exec playwright install chromium'); }
    const browser = await chromium.launch({ headless: true });
    try {
      fs.mkdirSync(folder, { recursive: true });
      folderCreated = true;
      if (state) {
        const worktrees = worktreeStatus(root);
        source.beforeChanges = worktrees.beforeChanges;
        source.afterChanges = worktrees.afterChanges;
        try {
          // Compare the After working tree against the pinned source SHA, so a
          // patch committed inside the After worktree is still captured.
          const contents = execFileSync('git', ['diff', '--binary', '--no-ext-diff', state.sha], {
            cwd: state.after, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024,
          });
          const hash = crypto.createHash('sha256').update(contents).digest('hex');
          const changed = contents.length > 0;
          source.currentDiff = { base: state.sha, sha256: hash, changed, file: changed ? `${stamp}/after-change.patch` : null };
          if (changed) fs.writeFileSync(path.join(folder, 'after-change.patch'), contents);
        } catch (e) { source.currentDiff = { error: `Could not capture current diff: ${e.message}` }; }
      }
      for (const condition of CONDITIONS) {
        for (const side of ['before', 'after']) {
          const context = await browser.newContext({
            viewport: { width: condition.width, height: condition.height },
            colorScheme: condition.colorScheme,
            forcedColors: condition.forcedColors,
            reducedMotion: 'reduce',
          });
          try {
            const page = await context.newPage();
            const url = `http://127.0.0.1:${config.ports[side]}${config.comparison.path}`;
            const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
            if (!response || response.status() >= 400) throw new Error(`Page request failed: ${response?.status() ?? 'no response'}`);
            const isDemo = response.headers()['x-diff-lab-demo'] === '1';
            if (isDemo) demoFixtures = true;
            const scenario = await scenarioOnPage(page);
            const observed = await page.evaluate(() => ({
              forcedColors: matchMedia('(forced-colors: active)').matches,
              dark: matchMedia('(prefers-color-scheme: dark)').matches,
              reducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches,
            }));
            if (condition.forcedColors === 'active' && !observed.forcedColors) throw new Error('Browser did not apply forced colors');
            const filename = `${condition.id}-${side}.png`;
            await page.screenshot({ path: path.join(folder, filename), fullPage: true, animations: 'disabled' });
            const axe = await axeForPage(page);
            let ariaError = null;
            const ariaSnapshot = await page.locator('body').ariaSnapshot({ timeout: 10000 }).catch(e => { ariaError = e.message; return `Unavailable: ${e.message}`; });
            const snapshotName = `${condition.id}-${side}.aria.txt`;
            fs.writeFileSync(path.join(folder, snapshotName), ariaSnapshot + '\n');
            runs.push({
              side,
              condition: condition.id,
              url,
              viewport: { width: condition.width, height: condition.height },
              requested: { colorScheme: condition.colorScheme, forcedColors: condition.forcedColors, reducedMotion: 'reduce' },
              observed,
              scenario,
              demo: isDemo,
              screenshot: `${stamp}/${filename}`,
              ariaSnapshot: `${stamp}/${snapshotName}`,
              ariaError,
              axe,
            });
          } catch (e) {
            runs.push({ side, condition: condition.id, error: e.message });
          } finally { await context.close().catch(() => {}); }
        }
      }
    } finally { await browser.close().catch(() => {}); }
    const report = {
      available: true,
      failed: false,
      timestamp,
      folder: stamp,
      comparison,
      source: { ...source, demoFixtures },
      note: NOTE + (demoFixtures ? ' Some pages identified themselves as demo fixtures, not BlockNote; do not cite this report as editor evidence.' : ''),
      runs,
    };
    writeJson(path.join(folder, 'report.json'), report);
    writeJson(latestFile, report);
    return report;
  } catch (e) {
    try { writeFailure(e); } catch { /* preserve the original failure */ }
    throw e;
  }
}
