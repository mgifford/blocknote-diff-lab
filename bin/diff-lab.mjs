#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync, spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { readConfig, projectPaths, readState } from '../lib/config.mjs';
import { prepare, worktreeStatus } from '../lib/git.mjs';
import { createDemoServer, createLabServer, isServing } from '../lib/server.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const config = readConfig(root);
const command = process.argv[2] || 'help';
const args = process.argv.slice(3);
const paths = projectPaths(root);

function valueOf(flag) {
  const i = args.indexOf(flag);
  if (i < 0) return undefined;
  if (i + 1 >= args.length) throw new Error(`${flag} requires a value`);
  return args[i + 1];
}
function toolVersion(cmd, parameters = ['--version']) {
  try { return execFileSync(cmd, parameters, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim().split('\n')[0]; }
  catch { return 'not installed or unavailable'; }
}
function checkPrepared() {
  const state = readState(root);
  if (!state) throw new Error('No Git worktrees prepared. Run pnpm lab:prepare (or node bin/diff-lab.mjs prepare) [--repo /path/to/BlockNote]');
  if (!fs.existsSync(path.join(paths.before, 'playground')) || !fs.existsSync(path.join(paths.after, 'playground'))) throw new Error('The two BlockNote playground folders are missing');
  return state;
}
function runPnpm(cwd, argv) {
  const result = spawn('pnpm', argv, { cwd, stdio: 'inherit', env: process.env });
  return new Promise((resolve, reject) => {
    result.on('error', reject);
    result.on('exit', code => code === 0 ? resolve() : reject(new Error(`pnpm exited ${code}`)));
  });
}
function listen(server, port) {
  return new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(port, '127.0.0.1', resolve);
  });
}
function startChild(side, cwd, port) {
  const child = spawn('pnpm', ['exec', 'vp', 'dev', '--host', '127.0.0.1', '--port', String(port), '--strictPort'], {
    cwd: path.join(cwd, 'playground'),
    stdio: 'inherit',
    env: { ...process.env, BROWSER: 'none' },
  });
  child.on('error', err => console.error(`[${side}] Failed to launch vp: ${err.message}`));
  child.on('exit', code => console.error(`[${side}] Vite+ stopped (${code}).`));
  return child;
}

async function start(demo = false) {
  if (!demo) checkPrepared();
  const children = [];
  const servers = [];
  if (demo) {
    for (const side of ['before', 'after']) {
      const server = createDemoServer(side);
      await listen(server, config.ports[side]);
      servers.push(server);
    }
  } else {
    children.push(startChild('before', paths.before, config.ports.before));
    children.push(startChild('after', paths.after, config.ports.after));
  }
  const viewer = createLabServer(root, config, { demo });
  await listen(viewer, config.ports.viewer);
  servers.push(viewer);
  let shuttingDown = false;
  const cleanup = () => {
    if (shuttingDown) return;
    shuttingDown = true;
    children.forEach(child => child.kill('SIGTERM'));
    servers.forEach(server => server.close());
  };
  process.on('SIGINT', () => { cleanup(); process.exit(0); });
  process.on('SIGTERM', () => { cleanup(); process.exit(0); });
  console.log(`\nDiff Lab: http://localhost:${config.ports.viewer}/`);
  console.log(`Before:  http://127.0.0.1:${config.ports.before}${config.comparison.path}`);
  console.log(`After:   http://127.0.0.1:${config.ports.after}${config.comparison.path}`);
  console.log(demo ? '\nDEMO ONLY: synthetic pages; not BlockNote builds.' : '\nLIVE: both editor instances are built from upstream source.');
  console.log('Use the viewer button to open a controlled Chromium instance for per-frame forced colours.');
  if (!demo) {
    let attempts = 0;
    const interval = setInterval(async () => {
      attempts++;
      const [before, after] = await Promise.all([isServing(config.ports.before), isServing(config.ports.after)]);
      if (before && after) { console.log('Both Vite+ servers respond.'); clearInterval(interval); }
      else if (attempts > 120) { console.error('Editor servers not ready. Inspect Vite+ startup logs.'); clearInterval(interval); }
    }, 1000);
    interval.unref();
  }
}

try {
  switch (command) {
    case 'help':
      console.log(`BlockNote Diff Lab starter commands:\n  pnpm doctor\n  pnpm demo                   # no BlockNote download; verify viewer controls\n  node bin/diff-lab.mjs prepare [--repo PATH] [--patch FILE] [--update] [--rev SHA]\n  pnpm lab:prepare            # package-script alias for prepare (no arguments)\n  pnpm install:before\n  pnpm install:after\n  pnpm start                  # two actual BlockNote playground dev servers\n  pnpm capture                # screenshots + axe + keyboard scenario\n  pnpm test                   # unit tests; no BlockNote download\n  node bin/diff-lab.mjs status`);
      break;
    case 'doctor':
      console.log(JSON.stringify({ node: process.version, git: toolVersion('git'), pnpm: toolVersion('pnpm'), vp: toolVersion('vp'), config: config.comparison.id, state: readState(root), sizes: Object.fromEntries(['before', 'after'].map(s => [s, fs.existsSync(paths[s]) ? 'present' : 'absent'])) }, null, 2));
      break;
    case 'prepare':
      console.log(JSON.stringify(prepare(root, config, { repo: valueOf('--repo'), patch: valueOf('--patch'), rev: valueOf('--rev'), update: args.includes('--update') }), null, 2));
      break;
    case 'install': {
      checkPrepared();
      const side = valueOf('--side');
      if (!['before', 'after', 'both'].includes(side)) throw new Error('Use --side before, --side after, or --side both');
      for (const target of side === 'both' ? ['before', 'after'] : [side]) {
        console.log(`Installing ${target} workspace. pnpm shares its package store between worktrees.`);
        await runPnpm(paths[target], ['install', '--frozen-lockfile']);
      }
      break;
    }
    case 'start': await start(false); break;
    case 'demo': await start(true); break;
    case 'capture': {
      const { capture } = await import('../lib/capture.mjs');
      const report = await capture(root, config);
      const errors = report.runs.filter(run => run.error);
      console.log(`Wrote reports/${report.folder}/report.json and reports/latest.json with ${report.runs.length} runs (${errors.length} incomplete).`);
      if (report.source?.demoFixtures) console.warn('WARNING: This capture used demo fixtures, not BlockNote. Do not cite it as editor evidence.');
      if (errors.length) { console.error(errors.map(e => `${e.condition}/${e.side}: ${e.error}`).join('\n')); process.exitCode = 1; }
      break;
    }
    case 'status': console.log(JSON.stringify(worktreeStatus(root) || { prepared: false }, null, 2)); break;
    default: throw new Error(`Unknown command ${command}`);
  }
} catch (e) {
  console.error(`Error: ${e.message}`);
  process.exitCode = 1;
}
