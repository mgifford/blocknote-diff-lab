import { test, expect } from '@playwright/test';
import { previewUrl, saveEvidence } from './helpers.mjs';

test.describe('@semantics @previews — ATAG B.2.1.1 / B.2.2.2 accessible content production', () => {
  test.skip(process.env.SKIP_NETWORK === '1', 'external preview checks skipped (SKIP_NETWORK=1)');

  test('#2822 image has no alt name before and has a fallback name after', async ({ page }) => {
    const result = {};
    for (const role of ['before', 'after']) {
      await page.goto(previewUrl(2822, role), { waitUntil: 'domcontentloaded' });
      await page.locator('.bn-editor').waitFor({ state: 'visible', timeout: 30000 });
      await page.waitForTimeout(500);
      result[role] = await page.evaluate(() => [...document.querySelectorAll('.bn-editor img')].map((image) => ({
        alt: image.getAttribute('alt'),
        named: Boolean((image.getAttribute('alt') || '').trim()),
      })));
    }
    expect(result.before.length).toBe(1);
    expect(result.before[0].named).toBe(false);
    expect(result.after.length).toBe(1);
    expect(result.after[0].named).toBe(true);
    saveEvidence('semantics-2822-image.json', result);
  });

  for (const number of [2825, 2826]) {
    test(`#${number} table headers gain explicit scope and headers relationships`, async ({ page }) => {
      const result = {};
      for (const role of ['before', 'after']) {
        await page.goto(previewUrl(number, role), { waitUntil: 'domcontentloaded' });
        await page.locator('.bn-editor').waitFor({ state: 'visible', timeout: 30000 });
        await page.waitForTimeout(500);
        result[role] = await page.evaluate(() => ({
          th: document.querySelectorAll('.bn-editor th').length,
          thWithScope: document.querySelectorAll('.bn-editor th[scope]').length,
          thWithId: document.querySelectorAll('.bn-editor th[id]').length,
          tdWithHeaders: document.querySelectorAll('.bn-editor td[headers]').length,
          mergedCells: document.querySelectorAll('.bn-editor td[colspan], .bn-editor td[rowspan], .bn-editor th[colspan], .bn-editor th[rowspan]').length,
        }));
      }
      expect(result.before.th).toBeGreaterThan(0);
      expect(result.before.thWithScope).toBe(0);
      expect(result.before.thWithId).toBe(0);
      expect(result.before.tdWithHeaders).toBe(0);
      expect(result.after.thWithScope).toBeGreaterThan(0);
      expect(result.after.thWithId).toBeGreaterThan(0);
      expect(result.after.tdWithHeaders).toBeGreaterThan(0);
      expect(result.after.mergedCells).toBeGreaterThan(0);
      saveEvidence(`semantics-${number}-table.json`, result);
    });
  }

  test('#2809 read-only list items have no list wrappers', async ({ page }) => {
    await page.goto(previewUrl(2809, 'before'), { waitUntil: 'domcontentloaded' });
    await page.locator('.bn-editor').waitFor({ state: 'visible', timeout: 30000 });
    await page.waitForTimeout(500);
    const result = await page.evaluate(() => ({
      contenteditables: document.querySelectorAll('.bn-editor [contenteditable="true"]').length,
      ul: document.querySelectorAll('.bn-editor ul').length,
      ol: document.querySelectorAll('.bn-editor ol').length,
      li: document.querySelectorAll('.bn-editor li').length,
      blocks: document.querySelectorAll('.bn-editor .bn-block').length,
      listItemText: [...document.querySelectorAll('.bn-editor .bn-block-content')]
        .map((block) => block.innerText.trim())
        .filter((text) => /List Item/.test(text)),
    }));
    expect(result.contenteditables).toBe(0);
    expect(result.ul).toBe(0);
    expect(result.ol).toBe(0);
    expect(result.li).toBe(0);
    expect(result.listItemText.length).toBeGreaterThanOrEqual(4);
    saveEvidence('semantics-2809-lists.json', result);
  });
});
