#!/usr/bin/env node
// Network smoke check for the external Playground previews used by the static
// comparator. The route contract test can only prove that a URL names an
// example; this script proves the deployment still renders that example and
// that the current-main / PR difference is still present.
//
// Not part of the Pages deploy gate: it depends on Vercel and the upstream
// preview deployments. Run manually or from the Preview route smoke check
// workflow.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const { issues } = JSON.parse(fs.readFileSync(path.join(root, 'pages', 'issues.json'), 'utf8'));

function expectedProblems(issue, role, stats) {
  const problems = [];
  switch (issue.number) {
    case 2822:
      if (role === 'before') {
        if (stats.images < 1) problems.push('Default Schema Showcase no longer contains an image');
        if (stats.imagesMissingAlt < 1) problems.push('current main image unexpectedly has alt text');
      } else if (stats.imagesWithAlt < 1) {
        problems.push('PR preview image has no alt fallback');
      }
      break;
    case 2825:
    case 2826:
      if (role === 'before') {
        if (stats.th < 1) problems.push('Advanced Tables no longer contains header cells');
        if (stats.thWithScope !== 0) problems.push(`current main now has ${stats.thWithScope} th[scope]`);
        if (stats.tdWithHeaders !== 0) problems.push(`current main now has ${stats.tdWithHeaders} td[headers]`);
      } else {
        if (stats.thWithScope < 1) problems.push('PR preview has no th[scope]');
        if (stats.tdWithHeaders < 1) problems.push('PR preview has no td[headers]');
      }
      break;
    case 2809:
      if (role === 'before') {
        if (stats.contenteditables !== 0) problems.push('Read-only Editor example is editable again');
        if (stats.blocks < 1) problems.push('Read-only Editor example has no blocks');
      }
      break;
    case 2853:
      if (role === 'before') {
        if (stats.tables < 1) problems.push('Default Schema Showcase no longer contains a table');
        if (stats.videos < 1) problems.push('Default Schema Showcase no longer contains a video');
      }
      break;
    case 2829:
      if (role === 'before' && stats.tables < 1) problems.push('Advanced Tables no longer contains a table');
      break;
    default:
      break;
  }
  return problems;
}

const targets = [];
for (const issue of issues) {
  if (issue.fix.beforeUrl) targets.push({ issue, role: 'before', url: issue.fix.beforeUrl });
  if (issue.fix.previewUrl) targets.push({ issue, role: 'after', url: issue.fix.previewUrl });
}

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
let failed = 0;
const startedAt = new Date().toISOString();
console.log(`Preview route smoke check — ${startedAt} — ${targets.length} targets`);

try {
  for (const { issue, role, url } of targets) {
    const problems = [];
    const pageErrors = [];
    let stats = null;
    const onError = (error) => pageErrors.push(error.message);
    page.on('pageerror', onError);
    try {
      const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
      if (!response || response.status() >= 400) problems.push(`HTTP ${response?.status() ?? 'no response'}`);
      await page.waitForSelector('.bn-editor', { timeout: 30000 });
      await page.waitForTimeout(1000);
      stats = await page.evaluate(() => ({
        editors: document.querySelectorAll('.bn-editor').length,
        blocks: document.querySelectorAll('.bn-block').length,
        images: document.querySelectorAll('img').length,
        imagesMissingAlt: [...document.querySelectorAll('img')].filter((image) => !image.getAttribute('alt')).length,
        imagesWithAlt: [...document.querySelectorAll('img')].filter((image) => (image.getAttribute('alt') || '').trim()).length,
        tables: document.querySelectorAll('table').length,
        th: document.querySelectorAll('th').length,
        thWithScope: document.querySelectorAll('th[scope]').length,
        tdWithHeaders: document.querySelectorAll('td[headers]').length,
        videos: document.querySelectorAll('video').length,
        contenteditables: document.querySelectorAll('[contenteditable="true"]').length,
      }));
      if (new URL(page.url()).pathname === '/') problems.push('redirected to the Playground index');
      if (stats.editors < 1) problems.push('no .bn-editor');
      if (stats.blocks < 1) problems.push('no blocks');
      problems.push(...expectedProblems(issue, role, stats));
    } catch (error) {
      problems.push(error.message.split('\n')[0]);
    } finally {
      page.off('pageerror', onError);
    }
    if (pageErrors.length) problems.push(`page error: ${pageErrors[0]}`);
    if (problems.length) {
      failed++;
      console.log(`FAIL #${issue.number} ${role.padEnd(6)} ${url}`);
      for (const problem of problems) console.log(`     - ${problem}`);
    } else {
      console.log(`ok   #${issue.number} ${role.padEnd(6)} ${stats.blocks} blocks, ${stats.tables} table(s), ${stats.images} image(s)`);
    }
  }
} finally {
  await browser.close();
}

if (failed) {
  console.error(`\n${failed} of ${targets.length} preview targets failed. Check the catalog routes and the upstream deployments.`);
  process.exitCode = 1;
} else {
  console.log(`\nAll ${targets.length} preview targets rendered and matched their expected main/PR state.`);
}
