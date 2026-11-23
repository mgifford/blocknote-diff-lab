import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { projectPaths, readState } from './config.mjs';

function git(cwd, ...args) {
  return execFileSync('git', args, { cwd, stdio: ['ignore', 'pipe', 'pipe'], encoding: 'utf8', maxBuffer: 4 * 1024 * 1024 }).trim();
}

function existingGitRepository(dir) {
  try { git(dir, 'rev-parse', '--git-dir'); return true; }
  catch { return false; }
}

function parseRef(value) {
  if (!/^[a-zA-Z0-9_./-]+$/.test(value) || value.includes('..') || value.startsWith('-')) throw new Error('Unsafe Git ref');
  return value;
}

export function prepare(root, config, options = {}) {
  const paths = projectPaths(root);
  fs.mkdirSync(paths.lab, { recursive: true });
  let source;
  if (options.repo) {
    source = path.resolve(options.repo);
    if (!existingGitRepository(source)) throw new Error(`No Git checkout found at ${source}`);
  } else {
    source = paths.source;
    if (!existingGitRepository(source)) {
      if (fs.existsSync(source)) throw new Error(`Source path is occupied: ${source}`);
      fs.mkdirSync(path.dirname(source), { recursive: true });
      execFileSync('git', ['clone', '--no-checkout', '--single-branch', '--depth', '1', '--filter=blob:none', '--branch', parseRef(config.source.branch), config.source.url, source], { stdio: 'inherit' });
    }
  }
  if (options.update) {
    // Explicit opt-in to network fetch. Existing user checkouts are otherwise left unchanged.
    git(source, 'fetch', '--no-tags', '--depth', '1', 'origin', parseRef(config.source.branch));
  }
  const rev = options.rev || (options.update ? 'FETCH_HEAD' : 'HEAD');
  const sha = git(source, 'rev-parse', '--verify', `${rev}^{commit}`);
  const patch = options.patch ?? config.comparison.patchFile;
  const patchFile = patch ? path.resolve(root, patch) : null;
  const patchHash = patchFile ? crypto.createHash('sha256').update(fs.readFileSync(patchFile)).digest('hex') : null;
  const previous = readState(root);
  if (previous) {
    if (previous.sha !== sha || previous.patchHash !== patchHash || previous.repository !== source) {
      throw new Error('A different snapshot already exists. Do not delete worktrees automatically. See README: resetting a comparison.');
    }
    if (!fs.existsSync(paths.before) || !fs.existsSync(paths.after)) throw new Error('Snapshot metadata exists but worktrees are missing. Investigate before continuing.');
    return { ...previous, reused: true };
  }
  if (fs.existsSync(paths.before) || fs.existsSync(paths.after)) throw new Error('A comparison worktree already exists without matching metadata. Refusing to overwrite it.');
  fs.mkdirSync(path.dirname(paths.before), { recursive: true });
  git(source, 'worktree', 'add', '--detach', paths.before, sha);
  try {
    git(source, 'worktree', 'add', '--detach', paths.after, sha);
    if (patchFile) {
      git(paths.after, 'apply', '--check', patchFile);
      git(paths.after, 'apply', patchFile);
    }
  } catch (e) {
    // Before worktree is left intact for diagnosis rather than deleting uncommitted work.
    throw new Error(`Failed to prepare After tree: ${e.message}. Inspect worktrees before cleaning up.`);
  }
  const state = {
    comparisonId: config.comparison.id,
    sha,
    shaShort: sha.slice(0, 12),
    repository: source,
    patchFile,
    patchHash,
    before: paths.before,
    after: paths.after,
    preparedAt: new Date().toISOString(),
    patched: !!patchFile,
  };
  // Write atomically so an interrupted prepare cannot leave a half-written
  // state file that the viewer later tries to parse.
  const tempState = `${paths.state}.${process.pid}.tmp`;
  fs.writeFileSync(tempState, JSON.stringify(state, null, 2) + '\n');
  fs.renameSync(tempState, paths.state);
  return state;
}

export function worktreeStatus(root) {
  const paths = projectPaths(root);
  const state = readState(root);
  if (!state) return null;
  return {
    ...state,
    beforeChanges: git(paths.before, 'status', '--short'),
    afterChanges: git(paths.after, 'status', '--short'),
  };
}
