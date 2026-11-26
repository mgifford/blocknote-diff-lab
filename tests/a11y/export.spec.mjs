import { test, expect } from '@playwright/test';
import { saveEvidence } from './helpers.mjs';

const modifier = process.platform === 'darwin' ? 'Meta' : 'Control';
const EXPORT_HTML = 'https://blocknote-git-main-typecell.vercel.app/interoperability/converting-blocks-to-html';

// Upstream previews are context only: this lab does not review or approve pull requests.
test.describe('@export @previews — ATAG B.1.2.1/B.1.2.4 HTML export', () => {
  test.skip(process.env.SKIP_NETWORK === '1', 'external preview checks skipped (SKIP_NETWORK=1)');

  test('HTML export keeps list structure and image alt text', async ({ page }) => {
    await page.goto(EXPORT_HTML, { waitUntil: 'domcontentloaded' });
    await page.locator('.bn-editor').waitFor({ state: 'visible', timeout: 30000 });
    await page.waitForTimeout(1000);

    const output = () => page.evaluate(() => {
      const pre = [...document.querySelectorAll('pre')].at(-1);
      return pre?.innerText ?? '';
    });

    await page.locator('.bn-editor').click();
    await page.keyboard.press(`${modifier}+a`);
    await page.keyboard.type('- One');
    await page.keyboard.press('Enter');
    await page.keyboard.type('- Two');
    await page.waitForFunction(() => {
      const pre = [...document.querySelectorAll('pre')].at(-1);
      return pre?.innerText.includes('<ul>') && pre?.innerText.includes('One');
    });

    const listHtml = await output();
    expect(listHtml).toContain('<ul>');
    expect(listHtml).toContain('<li>');
    expect(listHtml).toContain('One');
    expect(listHtml).toContain('Two');

    const imageHtml = '<p><img src="https://placehold.co/100x100.png" alt="A small cat"></p>';
    await page.evaluate((payload) => {
      const target = document.querySelector('.bn-editor');
      target.focus();
      const data = new DataTransfer();
      data.setData('text/html', payload);
      data.setData('text/plain', 'A small cat');
      target.dispatchEvent(new ClipboardEvent('paste', { clipboardData: data, bubbles: true, cancelable: true }));
    }, imageHtml);
    await page.waitForFunction(() => {
      const pre = [...document.querySelectorAll('pre')].at(-1);
      return pre?.innerText.includes('alt="A small cat"');
    });

    const exported = await output();
    const editor = await page.evaluate(() => ({
      lists: document.querySelectorAll('.bn-editor ul, .bn-editor li').length,
      images: [...document.querySelectorAll('.bn-editor img')].map((image) => image.getAttribute('alt')),
    }));

    expect(exported).toContain('alt="A small cat"');
    expect(editor.lists).toBe(0);
    expect(editor.images).toEqual(['A small cat']);

    saveEvidence('b02-html-export.json', { listHtml, exported, editor });
  });

  test('HTML export keeps table header cells but has no language or explicit-relationship model', async ({ page }) => {
    await page.goto(EXPORT_HTML, { waitUntil: 'domcontentloaded' });
    await page.locator('.bn-editor').waitFor({ state: 'visible', timeout: 30000 });
    await page.waitForTimeout(1000);

    const source = '<p lang="fr">Bonjour</p>'
      + '<table><thead><tr><th id="h1" scope="col">Name</th></tr></thead>'
      + '<tbody><tr><td headers="h1">A</td></tr></tbody></table>';
    await page.locator('.bn-editor').click();
    await page.evaluate((payload) => {
      const target = document.querySelector('.bn-editor');
      target.focus();
      const data = new DataTransfer();
      data.setData('text/html', payload);
      data.setData('text/plain', 'Bonjour Name A');
      target.dispatchEvent(new ClipboardEvent('paste', { clipboardData: data, bubbles: true, cancelable: true }));
    }, source);
    await page.waitForFunction(() => {
      const pre = [...document.querySelectorAll('pre')].at(-1);
      return pre?.innerText.includes('<table>');
    });

    const exported = await page.evaluate(() => [...document.querySelectorAll('pre')].at(-1)?.innerText ?? '');
    const editor = await page.evaluate(() => ({
      langs: [...document.querySelectorAll('.bn-editor [lang]')].map((element) => element.getAttribute('lang')),
      th: [...document.querySelectorAll('.bn-editor th')].map((cell) => ({
        id: cell.id,
        scope: cell.getAttribute('scope'),
      })),
      tdHeaders: [...document.querySelectorAll('.bn-editor td[headers]')].map((cell) => cell.getAttribute('headers')),
    }));

    expect(exported).toContain('<table>');
    expect(exported).toContain('<th');
    // The default schema has no content-language property, and table content
    // has only headerRows/headerCols, not scope/id/headers relationships.
    expect(exported).not.toContain('lang="fr"');
    expect(exported).not.toContain('scope=');
    expect(exported).not.toContain('headers=');
    expect(editor.langs).toEqual([]);
    expect(editor.th).toEqual([{ id: '', scope: null }]);
    expect(editor.tdHeaders).toEqual([]);

    saveEvidence('b02-language-table-export.json', { exported, editor });
  });
});
