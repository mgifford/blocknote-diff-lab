import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { validateConfig, readState, projectPaths } from '../lib/config.mjs';
import { BROWSER_MODES } from '../lib/browser.mjs';

function base() {
  return {
    source: { url: 'https://github.com/TypeCellOS/BlockNote.git', branch: 'main' },
    comparison: { id: 'focus-test', title: 'Keyboard test', path: '/basic/minimal?hideMenu', patchFile: null, steps: [{ id: 'tab', instruction: 'Press Tab', expectedBefore: 'Record focus', expectedAfter: 'Observe focus' }] },
    ports: { viewer: 8100, before: 5173, after: 5174 },
  };
}

test('valid manifest with reproduction steps is accepted', () => {
  assert.equal(validateConfig(base()).comparison.steps[0].id, 'tab');
});
test('invalid branch and duplicate ports are refused', () => {
  const a = base(); a.source.branch = '--upload-pack=xyz';
  assert.throws(() => validateConfig(a), /Invalid source.branch/);
  const b = base(); b.ports.after = b.ports.before;
  assert.throws(() => validateConfig(b), /ports/);
});
test('missing steps and duplicate step ids are refused', () => {
  const a = base(); a.comparison.steps = [];
  assert.throws(() => validateConfig(a), /At least one/);
  const b = base(); b.comparison.steps.push({ ...b.comparison.steps[0] });
  assert.throws(() => validateConfig(b), /unique/);
});
test('forced light and dark use actual CDP forced-colors emulation', () => {
  assert.deepEqual(BROWSER_MODES['forced-light'], [{ name:'forced-colors', value:'active' }, { name:'prefers-color-scheme', value:'light' }]);
  assert.deepEqual(BROWSER_MODES['forced-dark'], [{ name:'forced-colors', value:'active' }, { name:'prefers-color-scheme', value:'dark' }]);
});
test('the lab does not occupy the npm prepare lifecycle hook', () => {
  const pkg = JSON.parse(fs.readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
  assert.equal(pkg.scripts.prepare, undefined, 'a prepare script would clone BlockNote on pnpm install');
  assert.equal(typeof pkg.scripts['lab:prepare'], 'string');
});
test('a corrupt state file is reported clearly', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'diff-lab-state-'));
  try {
    const paths = projectPaths(root);
    fs.mkdirSync(path.dirname(paths.state), { recursive: true });
    fs.writeFileSync(paths.state, '{not json');
    assert.throws(() => readState(root), /Cannot read .*state\.json/);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});
