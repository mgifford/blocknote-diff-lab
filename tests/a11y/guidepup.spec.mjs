import { test, expect } from '@playwright/test';
import { previewUrl, saveEvidence, spokenPhrases } from './helpers.mjs';

test.describe('@guidepup @previews — Virtual Screen Reader (Guidepup)', () => {
  test.skip(process.env.SKIP_NETWORK === '1', 'external preview checks skipped (SKIP_NETWORK=1)');

  test('#2822 image is silent before and announced with its fallback name after', async ({ page }) => {
    const phrases = {};
    for (const role of ['before', 'after']) {
      await page.goto(previewUrl(2822, role), { waitUntil: 'domcontentloaded' });
      await page.locator('.bn-editor').waitFor({ state: 'visible', timeout: 30000 });
      await page.waitForTimeout(800);
      phrases[role] = await spokenPhrases(page, '.bn-editor');
    }

    const imagePhrases = (role) => phrases[role].filter((phrase) => /^image\b/.test(phrase));
    expect(imagePhrases('before')).toEqual([]);
    expect(imagePhrases('after')).toContain('image, 332x322.jpg');
    expect(phrases.before).toContain('From https://placehold.co/332x322.jpg');
    saveEvidence('guidepup-2822-image.json', phrases);
  });

  test('#2809 list items are spoken as paragraphs, with no list or listitem roles', async ({ page }) => {
    await page.goto(previewUrl(2809, 'before'), { waitUntil: 'domcontentloaded' });
    await page.locator('.bn-editor').waitFor({ state: 'visible', timeout: 30000 });
    await page.waitForTimeout(800);
    const phrases = await spokenPhrases(page, '.bn-editor');

    expect(phrases.filter((phrase) => /^list\b/.test(phrase))).toEqual([]);
    expect(phrases.filter((phrase) => /^listitem\b/.test(phrase))).toEqual([]);
    expect(phrases).toContain('Bullet List Item');
    expect(phrases).toContain('Numbered List Item');
    expect(phrases).toContain('Check List Item');
    expect(phrases).toContain('Toggle List Item');
    expect(phrases.filter((phrase) => phrase === 'paragraph').length).toBeGreaterThan(5);
    saveEvidence('guidepup-2809-lists.json', phrases);
  });
});
