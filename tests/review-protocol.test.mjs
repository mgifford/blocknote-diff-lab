import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';

const root = path.resolve(import.meta.dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

test('the repository review protocol exists and rejects direct main pushes', () => {
  const protocol = read('docs/REVIEW-PROTOCOL.md');
  assert.match(protocol, /branch \+ pull request/i);
  assert.match(protocol, /Direct\s+pushes/i);
  assert.match(protocol, /not part of the process/i);
  assert.match(protocol, /page-comparison-tests/);
  assert.match(protocol, /squash merge/i);
  assert.match(protocol, /upstream PR previews are context only/i);
  assert.match(protocol, /real AT.*out of scope/i);
});

test('the PR template asks for evidence, review focus and scope boundaries', () => {
  const template = read('.github/pull_request_template.md');
  for (const heading of ['## Summary', '## Evidence', '## Review focus', '## Checklist', '## Out of scope']) {
    assert.ok(template.includes(heading), `PR template is missing ${heading}`);
  }
  assert.match(template, /no direct push to `main`/i);
  assert.match(template, /real screen-reader/i);
  assert.match(template, /conformance claim/i);
});

test('the direct-main baseline review is linked and names the compare range', () => {
  const review = read('docs/reviews/2026-11-24-direct-main-baseline.md');
  assert.match(review, /ff06dd8\.\.\.f866040/);
  assert.match(review, /not an approval/i);
  assert.match(review, /what was not done/i);
  assert.match(review, /follow-up PRs/i);
  assert.match(read('docs/REVIEW-PROTOCOL.md'), /2026-11-24-direct-main-baseline\.md/);
});
