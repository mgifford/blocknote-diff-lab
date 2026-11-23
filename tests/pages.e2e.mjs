import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { chromium } from '@playwright/test';

const root = path.resolve(import.meta.dirname, '..');
const site = path.join(root, '_site');
const { issues } = JSON.parse(fs.readFileSync(path.join(root, 'pages', 'issues.json'), 'utf8'));

execFileSync(process.execPath, [path.join(root, 'scripts', 'build-pages.mjs')], { stdio: 'inherit' });

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.patch': 'text/plain; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
};

const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  let file = path.join(site, decodeURIComponent(url.pathname));
  if (url.pathname.endsWith('/')) file = path.join(file, 'index.html');
  if (!file.startsWith(site)) { res.writeHead(403).end(); return; }
  fs.readFile(file, (error, data) => {
    if (error) { res.writeHead(404).end('not found'); return; }
    res.writeHead(200, { 'content-type': mime[path.extname(file)] || 'application/octet-stream' });
    res.end(data);
  });
});
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const base = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
const pageErrors = [];
page.on('pageerror', (error) => pageErrors.push(error.message));

async function waitForIssue(number) {
  await page.waitForFunction(
    (n) => document.querySelector('#issue-title')?.textContent.startsWith(`#${n} —`),
    number,
    { timeout: 15000 },
  );
}

async function comparisonState() {
  return page.evaluate(() => {
    const visible = (id) => {
      const el = document.getElementById(id);
      return Boolean(el && !el.hidden && el.getBoundingClientRect().height > 0);
    };
    const height = (id) => document.querySelector(id)?.getBoundingClientRect().height || 0;
    return {
      local: visible('compare-panes'),
      pr: visible('pr-compare'),
      noFix: visible('no-fix-compare'),
      before: Math.max(height('#before'), height('#pr-before'), height('#nofix-before')),
      after: Math.max(height('#after'), height('#pr-after')),
      localPatch: visible('issue-2854-diff'),
      prPatch: visible('pr-patch'),
      noFixText: document.querySelector('.no-fix-after')?.textContent.replace(/\s+/g, ' ').trim() || '',
      afterSrc: document.querySelector('#pr-after')?.getAttribute('src') || '',
      issueCards: document.querySelectorAll('.issue-card').length,
    };
  });
}

try {
  for (const issue of issues) {
    await page.goto(`${base}/?case=${issue.number}#issue=${issue.number}`, { waitUntil: 'domcontentloaded' });
    await waitForIssue(issue.number);
    const state = await comparisonState();
    assert.equal(state.issueCards, 9, 'issue catalog is incomplete');
    assert.equal([state.local, state.pr, state.noFix].filter(Boolean).length, 1, `#${issue.number} must show exactly one comparison region`);

    if (issue.variants) {
      assert.equal(state.local, true, `#${issue.number} lost its local comparison`);
      assert.ok(state.before > 100 && state.after > 100, `#${issue.number} local frames are not visible`);
      assert.equal(state.localPatch, true, `#${issue.number} lost its patch`);
    } else if (issue.fix.kind === 'pr') {
      assert.equal(state.pr, true, `#${issue.number} lost its PR comparison`);
      assert.ok(state.before > 100 && state.after > 100, `#${issue.number} PR frames are not visible`);
      assert.equal(state.prPatch, true, `#${issue.number} lost its PR patch`);
      assert.ok(state.afterSrc.includes(issue.fix.previewUrl), `#${issue.number} after frame is not the PR preview`);
    } else {
      assert.equal(state.noFix, true, `#${issue.number} lost its no-fix comparison`);
      assert.ok(state.before > 100, `#${issue.number} before frame is not visible`);
      assert.match(state.noFixText, /No patch is available for this issue yet/, `#${issue.number} has no explicit no-fix state`);
    }
  }

  // Same-document hash changes must select the issue, not stay on the old one.
  await page.goto(`${base}/#issue=2854`, { waitUntil: 'domcontentloaded' });
  await waitForIssue(2854);
  await page.evaluate(() => { location.hash = '#issue=2822'; });
  await waitForIssue(2822);
  assert.equal((await comparisonState()).pr, true, 'hashchange did not switch to the PR comparison');

  // Clicking an issue card must switch to its comparison.
  await page.click('.issue-card[data-issue="977"]');
  await waitForIssue(977);
  assert.equal((await comparisonState()).noFix, true, 'issue card did not switch to the no-fix comparison');
  assert.match(page.url(), /#issue=977/);

  await page.setViewportSize({ width: 390, height: 900 });
  await page.waitForTimeout(300);
  const overflow = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));
  assert.ok(overflow.scrollWidth <= overflow.clientWidth + 1, `page overflows at 390px: ${overflow.scrollWidth} > ${overflow.clientWidth}`);

  assert.deepEqual(pageErrors, [], `page errors: ${pageErrors.join('; ')}`);
  console.log(`pages e2e: ${issues.length} issues have visible before/after comparisons; hash and card navigation pass.`);
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}
