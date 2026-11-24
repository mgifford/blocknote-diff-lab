import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';

const root = path.resolve(import.meta.dirname, '..');
const { issues } = JSON.parse(fs.readFileSync(path.join(root, 'pages', 'issues.json'), 'utf8'));
const template = fs.readFileSync(path.join(root, 'pages', 'index.template.html'), 'utf8');

test('the catalog contains the nine open issues with prefilled validation', () => {
  assert.equal(issues.length, 9);
  for (const issue of issues) {
    assert.ok(issue.steps.length > 0, `#${issue.number} has no steps`);
    assert.ok(issue.checks.length > 0, `#${issue.number} has no expected checks`);
    assert.match(issue.issueUrl, /^https:\/\/github\.com\/TypeCellOS\/BlockNote\/issues\/\d+$/);
  }
});

const pathOf = (url) => new URL(url).pathname;

test('every issue has a before/after route', () => {
  for (const issue of issues) {
    if (issue.variants) {
      assert.equal(issue.number, 2854, 'local variants are only expected for #2854');
      assert.equal(issue.fix.kind, 'local');
      continue;
    }
    if (issue.fix.kind === 'pr') {
      assert.match(issue.fix.beforeUrl, /^https:\/\//, `#${issue.number} has no before URL`);
      assert.match(issue.fix.previewUrl, /^https:\/\//, `#${issue.number} has no after URL`);
      assert.match(issue.fix.patchUrl, /^https:\/\//, `#${issue.number} has no patch URL`);
      assert.notEqual(pathOf(issue.fix.beforeUrl), '/', `#${issue.number} before URL still points at the Playground index`);
      assert.notEqual(pathOf(issue.fix.previewUrl), '/', `#${issue.number} after URL still points at the Playground index`);
      continue;
    }
    assert.match(issue.fix.beforeUrl, /^https:\/\//, `#${issue.number} has no before URL`);
    assert.notEqual(pathOf(issue.fix.beforeUrl), '/', `#${issue.number} before URL still points at the Playground index`);
    assert.equal(issue.fix.previewUrl, undefined, `#${issue.number} is not fixed but has an after URL`);
  }
});

test('external previews deep-link to a Playground example with the affected block', () => {
  for (const issue of issues.filter((candidate) => candidate.fix.kind !== 'local')) {
    for (const key of ['beforeUrl', 'previewUrl']) {
      const url = issue.fix[key];
      if (!url) continue;
      assert.match(
        pathOf(url),
        /^\/(?:basic|ui-components)\/[\w-]+$/,
        `#${issue.number} ${key} must name a Playground example route, not the index: ${url}`,
      );
    }
  }
});

test('the page keeps local, PR, and no-fix comparison regions', () => {
  for (const id of ['compare-panes', 'pr-compare', 'no-fix-compare', 'pr-patch', 'focus-status']) {
    assert.match(template, new RegExp(`id="${id}"`), `missing #${id}`);
  }
  assert.match(template, /hashchange/, 'missing hashchange navigation');
  assert.doesNotMatch(template, /id="no-local"/, 'stale no-local section');
});

test('the PR-backed issues use real previews and patch links', () => {
  const prs = issues.filter((issue) => issue.fix.kind === 'pr');
  assert.deepEqual(prs.map((issue) => issue.number), [2822, 2825, 2826]);
  for (const issue of prs) {
    assert.match(issue.fix.previewUrl, /vercel\.app/);
    assert.match(issue.fix.patchUrl, /github\.com\/TypeCellOS\/BlockNote\/pull\/\d+\/files/);
    assert.ok(issue.fix.changedFiles > 0);
  }
});
