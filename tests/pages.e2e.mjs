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
const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, acceptDownloads: true });
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
      noFixTitle: document.querySelector('#nofix-title')?.textContent.trim() || '',
      prBeforeSrc: document.querySelector('#pr-before')?.getAttribute('src') || '',
      prAfterSrc: document.querySelector('#pr-after')?.getAttribute('src') || '',
      noFixBeforeSrc: document.querySelector('#nofix-before')?.getAttribute('src') || '',
      issueCards: document.querySelectorAll('.issue-card').length,
    };
  });
}

const pathOf = (src) => {
  try { return new URL(src).pathname; } catch { return ''; }
};

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
      assert.ok(state.prAfterSrc.includes(issue.fix.previewUrl), `#${issue.number} after frame is not the PR preview`);
      assert.notEqual(pathOf(state.prBeforeSrc), '/', `#${issue.number} before frame still loads the Playground index`);
      assert.notEqual(pathOf(state.prAfterSrc), '/', `#${issue.number} after frame still loads the Playground index`);
    } else {
      assert.equal(state.noFix, true, `#${issue.number} lost its no-fix comparison`);
      assert.ok(state.before > 100, `#${issue.number} before frame is not visible`);
      assert.notEqual(pathOf(state.noFixBeforeSrc), '/', `#${issue.number} before frame still loads the Playground index`);
      assert.equal(state.noFixTitle, issue.fix.afterTitle || 'No patch is available for this issue yet', `#${issue.number} has no explicit no-fix title`);
      assert.ok(state.noFixText.length > 20, `#${issue.number} has no explicit no-fix explanation`);
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
  assert.match(await page.locator('.issue-card[data-issue="977"] .issue-meta').innerText(), /Reproduction only/);
  assert.match(await page.locator('.issue-card[data-issue="2829"] .issue-meta').innerText(), /Docs/);

  // Observations must survive a reload and export with build provenance.
  await page.evaluate(() => localStorage.clear());
  await page.goto(`${base}/#issue=2825`, { waitUntil: 'domcontentloaded' });
  await waitForIssue(2825);
  const expectedChecks = issues.find((issue) => issue.number === 2825).checks.length;
  assert.equal(await page.locator('#validate-table tbody tr').count(), expectedChecks, 'observation rows do not match the catalog checks');
  const observedInputs = page.locator('#validate-table tbody textarea');
  assert.equal(await observedInputs.count(), expectedChecks, 'each check needs an observed field');
  assert.match(await observedInputs.first().getAttribute('aria-label'), /Observed result for:/);

  await observedInputs.first().fill('th scope=col and td headers present in the PR pane');
  await page.locator('#issue-notes').fill('Chromium headless; screen reader still pending');
  await page.locator('#validate-steps input[type="checkbox"]').first().check();
  assert.match(await page.locator('#validate-progress').innerText(), /1 of 4 steps checked; 1 of 3 checks recorded/);

  await page.reload({ waitUntil: 'domcontentloaded' });
  await waitForIssue(2825);
  assert.equal(await observedInputs.first().inputValue(), 'th scope=col and td headers present in the PR pane', 'observed value did not persist');
  assert.equal(await page.locator('#issue-notes').inputValue(), 'Chromium headless; screen reader still pending', 'notes did not persist');

  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.click('#download-observations'),
  ]);
  const downloadPath = await download.path();
  assert.ok(downloadPath, 'observation download has no path');
  const exported = JSON.parse(fs.readFileSync(downloadPath, 'utf8'));
  assert.ok(exported.buildSha === 'unknown' || /^[0-9a-f]{7,40}$/i.test(exported.buildSha), `invalid build SHA: ${exported.buildSha}`);
  assert.match(exported.page, /#issue=2825/);
  const recorded = exported.issues.find((issue) => issue.number === 2825);
  assert.ok(recorded, 'export omitted the issue with observations');
  assert.equal(recorded.checks[0].observed, 'th scope=col and td headers present in the PR pane');
  assert.equal(recorded.notes, 'Chromium headless; screen reader still pending');
  assert.equal(recorded.steps[0].checked, true);

  page.once('dialog', (dialog) => dialog.accept());
  await page.click('#reset-checks');
  await page.waitForTimeout(200);
  assert.equal(await observedInputs.first().inputValue(), '', 'reset did not clear the observed value');
  assert.equal(await page.locator('#issue-notes').inputValue(), '', 'reset did not clear the notes');

  // Issue selection is pushState: Back returns through viewed issues and the
  // legacy page= parameter is normalised away.
  await page.goto(`${base}/#issue=2854&variant=both&page=minimal`, { waitUntil: 'domcontentloaded' });
  await waitForIssue(2854);
  assert.doesNotMatch(page.url(), /[?&]page=/, 'legacy page parameter should be normalised away');
  await page.click('.issue-card[data-issue="977"]');
  await waitForIssue(977);
  await page.click('.issue-card[data-issue="2822"]');
  await waitForIssue(2822);
  // Same-document pushState entries do not fire a load event, so use the
  // history API directly and wait for the rendered issue title.
  await page.evaluate(() => history.back());
  await waitForIssue(977);
  assert.match(page.url(), /#issue=977/);
  await page.evaluate(() => history.forward());
  await waitForIssue(2822);

  await page.setViewportSize({ width: 390, height: 900 });
  await page.waitForTimeout(300);
  const overflow = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));
  assert.ok(overflow.scrollWidth <= overflow.clientWidth + 1, `page overflows at 390px: ${overflow.scrollWidth} > ${overflow.clientWidth}`);

  assert.deepEqual(pageErrors, [], `page errors: ${pageErrors.join('; ')}`);
  console.log(`pages e2e: ${issues.length} issues, observations/export, hash/card/Back navigation pass.`);
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}
