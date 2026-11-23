import test from 'node:test';
import assert from 'node:assert/strict';
import { renderDemoFixture } from '../lib/demo-fixture.mjs';

test('demo fixtures are labelled two-author documents with scripted collaboration', () => {
  const before = renderDemoFixture('before');
  const after = renderDemoFixture('after');
  for (const html of [before, after]) {
    assert.match(html, /SIMULATED (BEFORE|AFTER) FIXTURE/);
    assert.match(html, /not BlockNote/);
    assert.match(html, /Maya Chen/);
    assert.match(html, /Sam Okafor/);
    assert.match(html, /diff-lab:collaborate/);
    assert.match(html, /Simulate collaborators/);
    assert.match(html, /prefers-reduced-motion/);
    assert.match(html, /remote-caret/);
    assert.match(html, /aria-pressed/);
  }
  assert.match(before, /outline:none/);
  assert.match(after, /outline:3px solid Highlight/);
  assert.notEqual(before, after);
});
