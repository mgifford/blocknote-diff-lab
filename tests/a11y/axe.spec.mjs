import { test, expect } from '@playwright/test';
import { previewUrl, saveEvidence, scan } from './helpers.mjs';

const localVariants = [
  'before/index.html',
  'after/index.html',
  'after-inert/index.html',
  'after-activation/index.html',
];

test.describe('@axe ATAG A.1.1.1 — local BlockNote editor UI', () => {
  test('every #2854 variant keeps the known editor textbox finding and no new WCAG A/AA rule', async ({ page }) => {
    const results = {};
    for (const variant of localVariants) {
      await page.goto(`/${variant}`, { waitUntil: 'domcontentloaded' });
      await page.locator('.bn-editor').waitFor({ state: 'visible', timeout: 30000 });
      await page.waitForTimeout(500);
      results[variant] = await scan(page);
      expect(results[variant].violations.map((violation) => violation.id)).toEqual(['aria-input-field-name']);
    }
    saveEvidence('axe-2854-local.json', results);
  });

  test('the comparator shell has no WCAG A/AA violations', async ({ page }) => {
    await page.goto('/#issue=2854&variant=both', { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => document.querySelector('#issue-title')?.textContent.startsWith('#2854 —'));
    await page.waitForTimeout(500);
    const result = await scan(page, {
      include: ['header', '.controls', '.changes', '.validate', 'footer', 'main'],
    });
    expect(result.violations).toEqual([]);
    saveEvidence('axe-comparator-shell.json', result);
  });
});

test.describe('@axe @previews ATAG B.2.1.1 — external authoring surfaces', () => {
  test.skip(process.env.SKIP_NETWORK === '1', 'external preview checks skipped (SKIP_NETWORK=1)');

  test('axe does not detect the #2822 missing alt-text authoring control', async ({ page }) => {
    const before = {};
    const after = {};
    for (const [role, bucket] of [['before', before], ['after', after]]) {
      await page.goto(previewUrl(2822, role), { waitUntil: 'domcontentloaded' });
      await page.locator('.bn-editor').waitFor({ state: 'visible', timeout: 30000 });
      await page.waitForTimeout(500);
      bucket.axe = await scan(page);
      bucket.images = await page.evaluate(() => [...document.querySelectorAll('.bn-editor img')].map((image) => ({
        alt: image.getAttribute('alt'),
        named: Boolean((image.getAttribute('alt') || '').trim()),
      })));
    }
    expect(before.images.every((image) => !image.named)).toBe(true);
    expect(after.images.every((image) => image.named)).toBe(true);
    expect(before.axe.violations.map((violation) => violation.id)).not.toContain('image-alt');
    expect(after.axe.violations.map((violation) => violation.id)).not.toContain('image-alt');
    saveEvidence('axe-2822-alt-blindspot.json', { before, after });
  });

  test('axe does not distinguish #2825/#2826 header relationships', async ({ page }) => {
    const result = {};
    for (const role of ['before', 'after']) {
      await page.goto(previewUrl(2825, role), { waitUntil: 'domcontentloaded' });
      await page.locator('.bn-editor').waitFor({ state: 'visible', timeout: 30000 });
      await page.waitForTimeout(500);
      result[role] = {
        standard: await scan(page),
        experimental: await scan(page, { rules: ['td-has-header'] }),
        headers: await page.evaluate(() => ({
          th: document.querySelectorAll('th').length,
          thWithScope: document.querySelectorAll('th[scope]').length,
          tdWithHeaders: document.querySelectorAll('td[headers]').length,
        })),
      };
    }
    for (const role of ['before', 'after']) {
      expect(result[role].standard.violations.map((violation) => violation.id)).not.toContain('td-headers-attr');
      expect(result[role].standard.violations.map((violation) => violation.id)).not.toContain('th-has-data-cells');
    }
    saveEvidence('axe-2825-table-blindspot.json', result);
  });

  test('axe does not flag the #2809 missing list wrappers', async ({ page }) => {
    await page.goto(previewUrl(2809, 'before'), { waitUntil: 'domcontentloaded' });
    await page.locator('.bn-editor').waitFor({ state: 'visible', timeout: 30000 });
    await page.waitForTimeout(500);
    const result = {
      axe: await scan(page),
      lists: await page.evaluate(() => ({
        ul: document.querySelectorAll('.bn-editor ul').length,
        ol: document.querySelectorAll('.bn-editor ol').length,
        li: document.querySelectorAll('.bn-editor li').length,
      })),
    };
    expect(result.lists).toEqual({ ul: 0, ol: 0, li: 0 });
    expect(result.axe.violations.map((violation) => violation.id)).not.toContain('list');
    expect(result.axe.violations.map((violation) => violation.id)).not.toContain('listitem');
    saveEvidence('axe-2809-list-blindspot.json', result);
  });
});
