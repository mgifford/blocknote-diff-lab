import { test, expect } from '@playwright/test';
import { saveEvidence } from './helpers.mjs';

// Upstream previews are context only: this lab does not review or approve pull requests.
// B-02 / B.1.2.1: an HTML paste is a restructuring transformation. This test
// records what the current-main editor keeps and drops.
test.describe('@transformations @previews — ATAG B.1.2.1 HTML paste', () => {
  test.skip(process.env.SKIP_NETWORK === '1', 'external preview checks skipped (SKIP_NETWORK=1)');

  test('HTML paste keeps image alt but drops list, table-header and language semantics', async ({ page }) => {
    await page.goto('https://blocknote-git-main-typecell.vercel.app/basic/minimal', { waitUntil: 'domcontentloaded' });
    await page.locator('.bn-editor').waitFor({ state: 'visible', timeout: 30000 });
    await page.waitForTimeout(800);
    await page.locator('.bn-editor').click();

    const html = [
      '<p lang="fr">Bonjour le monde</p>',
      '<ul><li>One</li><li>Two</li></ul>',
      '<table>',
      '<thead><tr><th id="h1" scope="col">Name</th></tr></thead>',
      '<tbody><tr><td headers="h1">A</td></tr></tbody>',
      '</table>',
      '<p><img src="https://placehold.co/100x100.png" alt="A small cat"></p>',
    ].join('');

    await page.evaluate((payload) => {
      const target = document.querySelector('.bn-editor');
      target.focus();
      const data = new DataTransfer();
      data.setData('text/html', payload);
      data.setData('text/plain', 'Bonjour le monde One Two Name A');
      target.dispatchEvent(new ClipboardEvent('paste', { clipboardData: data, bubbles: true, cancelable: true }));
    }, html);
    await page.waitForTimeout(1500);

    const stats = await page.evaluate(() => ({
      text: document.querySelector('.bn-editor')?.innerText.trim().slice(0, 300),
      lists: document.querySelectorAll('.bn-editor ul, .bn-editor ol, .bn-editor li').length,
      tables: document.querySelectorAll('.bn-editor table').length,
      th: [...document.querySelectorAll('.bn-editor th')].map((cell) => ({
        id: cell.id,
        scope: cell.getAttribute('scope'),
        text: cell.innerText.trim(),
      })),
      tdHeaders: [...document.querySelectorAll('.bn-editor td[headers]')].map((cell) => cell.getAttribute('headers')),
      images: [...document.querySelectorAll('.bn-editor img')].map((image) => ({
        alt: image.getAttribute('alt'),
        src: image.getAttribute('src'),
      })),
      langs: [...document.querySelectorAll('.bn-editor [lang]')].map((element) => ({
        tag: element.tagName,
        lang: element.getAttribute('lang'),
      })),
    }));

    expect(stats.text).toContain('Bonjour le monde');
    expect(stats.images).toEqual([{ alt: 'A small cat', src: 'https://placehold.co/100x100.png' }]);
    expect(stats.lists).toBe(0);
    expect(stats.tables).toBe(1);
    expect(stats.th).toEqual([{ id: '', scope: null, text: 'Name' }]);
    expect(stats.tdHeaders).toEqual([]);
    expect(stats.langs).toEqual([]);

    saveEvidence('b02-html-paste.json', stats);
  });
});
