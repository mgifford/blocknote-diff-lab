import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { prepare, worktreeStatus } from '../lib/git.mjs';

function command(cwd, ...args) {
  return execFileSync('git', args, { cwd, encoding:'utf8' }).trim();
}

test('one source checkout creates two pinned worktrees and applies a patch only to after', () => {
  const home = fs.mkdtempSync(path.join(os.tmpdir(), 'diff-lab-test-'));
  try {
    const source = path.join(home, 'source');
    const lab = path.join(home, 'lab');
    fs.mkdirSync(source);
    fs.mkdirSync(lab);
    command(source, 'init', '-b', 'main');
    command(source, 'config', 'user.email', 'test@example.invalid');
    command(source, 'config', 'user.name', 'Test');
    fs.mkdirSync(path.join(source, 'playground'));
    fs.writeFileSync(path.join(source, 'text.txt'), 'before\n');
    fs.writeFileSync(path.join(source, 'playground', 'index.html'), 'ok');
    command(source, 'add', '.');
    command(source, 'commit', '-m', 'Initial');
    const sha = command(source, 'rev-parse', 'HEAD');
    fs.writeFileSync(path.join(lab, 'focus.patch'), 'diff --git a/text.txt b/text.txt\n--- a/text.txt\n+++ b/text.txt\n@@ -1 +1 @@\n-before\n+after\n');
    const cfg = { source: { url:'https://example.invalid', branch:'main' }, comparison: { id:'focus', patchFile:'focus.patch' } };
    const state = prepare(lab, cfg, { repo:source });
    assert.equal(state.sha, sha);
    assert.equal(fs.readFileSync(path.join(lab, '.lab/worktrees/before/text.txt'), 'utf8'), 'before\n');
    assert.equal(fs.readFileSync(path.join(lab, '.lab/worktrees/after/text.txt'), 'utf8'), 'after\n');
    assert.equal(prepare(lab, cfg, { repo:source }).reused, true);
    const current = worktreeStatus(lab);
    assert.equal(current.beforeChanges, '');
    assert.match(current.afterChanges, /text.txt/);
    fs.writeFileSync(path.join(lab, 'focus.patch'), 'changed patch content\n');
    assert.throws(() => prepare(lab, cfg, { repo:source }), /different snapshot/);
  } finally {
    fs.rmSync(home, { recursive:true, force:true });
  }
});
