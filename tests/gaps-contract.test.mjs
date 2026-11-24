import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';

const root = path.resolve(import.meta.dirname, '..');
const gapsDir = path.join(root, 'docs', 'gaps');
const index = fs.readFileSync(path.join(gapsDir, 'README.md'), 'utf8');
const files = fs.readdirSync(gapsDir).filter((file) => file.endsWith('.md') && !file.startsWith('_') && file !== 'README.md');

test('the gap register indexes every A11yFirst and ATAG B record', () => {
  const linked = [...index.matchAll(/\]\((\w[\w-]*\.md)\)/g)].map((match) => match[1]);
  for (const file of files) {
    assert.ok(linked.includes(file), `${file} is not linked from docs/gaps/README.md`);
  }
  assert.ok(files.some((file) => file.startsWith('a11yfirst-')), 'no A11yFirst gap records');
  assert.ok(files.some((file) => file.startsWith('atag-b-')), 'no ATAG Part B gap records');
});

test('every gap record keeps the required evidence and scope sections', () => {
  const required = [
    '## Why this matters',
    '## Current BlockNote behavior',
    '## Evidence',
    '## Acceptance criteria',
    '## Out of scope for this record',
    '## References',
  ];
  for (const file of files) {
    const content = fs.readFileSync(path.join(gapsDir, file), 'utf8');
    assert.match(content, /^# (AF|B)-\d{2}:/, `${file} has no gap id heading`);
    assert.match(content, /- \*\*Status:\*\*/, `${file} has no status`);
    assert.match(content, /- \*\*Evidence basis:\*\*/, `${file} has no evidence basis`);
    for (const section of required) {
      assert.ok(content.includes(section), `${file} is missing ${section}`);
    }
    assert.match(content, /- \[ \] /, `${file} has no acceptance criteria items`);
    assert.match(content, /out of scope/i, `${file} does not state its scope`);
  }
});

test('the register keeps PR review and real AT out of scope', () => {
  assert.match(index, /review,\s+approve,\s+reject,\s+or\s+validate\s+an\s+upstream\s+pull\s+request/i);
  assert.match(index, /real\s+screen-reader\s+evaluation/i);
  assert.match(index, /testing\s+with\s+disabled\s+people/i);
  assert.match(index, /does \*\*not\*\*/i);
});
