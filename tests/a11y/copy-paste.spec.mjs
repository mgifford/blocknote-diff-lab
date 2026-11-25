import { test, expect } from '@playwright/test';
import { saveEvidence } from './helpers.mjs';

const modifier = process.platform === 'darwin' ? 'Meta' : 'Control';
const MAIN_MINIMAL = 'https://blocknote-git-main-typecell.vercel.app/basic/minimal';

// Upstream previews are context only: this lab does not review or approve pull requests.
test.describe('@copy-paste @previews — ATAG B.1.2.2 copy/paste', () => {
  test.skip(process.env.SKIP_NETWORK === '1', 'external preview checks skipped (SKIP_NETWORK=1)');

  test('copying an image and list emits HTML with alt and list structure', async ({ page }) => {
    await page.goto(MAIN_MINIMAL, { waitUntil: 'domcontentloaded' });
    await page.locator('.bn-editor').waitFor({ state: 'visible', timeout: 30000 });
    await page.waitForTimeout(600);
    await page.locator('.bn-editor').click();

    const source = '<p><img src="https://placehold.co/100x100.png" alt="A small cat"></p>'
      + '<ul><li>One</li><li>Two</li></ul>';
    await page.evaluate((payload) => {
      const target = document.querySelector('.bn-editor');
      target.focus();
      const data = new DataTransfer();
      data.setData('text/html', payload);
      data.setData('text/plain', 'A small cat One Two');
      target.dispatchEvent(new ClipboardEvent('paste', { clipboardData: data, bubbles: true, cancelable: true }));
    }, source);
    await page.waitForTimeout(1000);

    const editor = await page.evaluate(() => ({
      images: [...document.querySelectorAll('.bn-editor img')].map((image) => image.getAttribute('alt')),
      lists: document.querySelectorAll('.bn-editor ul, .bn-editor ol, .bn-editor li').length,
      text: document.querySelector('.bn-editor')?.innerText.trim(),
    }));
    expect(editor.images).toEqual(['A small cat']);
    expect(editor.lists).toBe(0);

    await page.locator('.bn-editor').click();
    // The first select-all can stop at the current block/table cell; repeat to
    // select the whole document.
    for (let i = 0; i < 3; i++) await page.keyboard.press(`${modifier}+a`);

    await page.evaluate(() => {
      window.__copyCapture = null;
      document.addEventListener('copy', (event) => {
        window.__copyCapture = {
          html: event.clipboardData?.getData('text/html') || '',
          text: event.clipboardData?.getData('text/plain') || '',
        };
      }, { once: true });
    });
    await page.keyboard.press(`${modifier}+c`);
    await page.waitForFunction(() => window.__copyCapture !== null);

    const captured = await page.evaluate(() => window.__copyCapture);
    expect(captured.html).toContain('alt="A small cat"');
    expect(captured.html).toContain('<ul>');
    expect(captured.html).toContain('<li>');
    expect(captured.html).toContain('One');
    expect(captured.html).toContain('Two');
    expect(captured.text).toContain('A small cat');

    saveEvidence('b02-copy-image-list.json', { editor, captured });
  });
});
