import { chromium } from '@playwright/test';
import fs from 'node:fs';
const port = Number(process.argv[2]);
const out = process.argv[3];
const browser = await chromium.launch({ headless: true });
async function runKey(key) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 840 } });
  try {
    await page.goto(`http://127.0.0.1:${port}/basic/minimal?hideMenu`, { waitUntil: 'domcontentloaded', timeout: 60000 });
    const editor = page.locator('.bn-editor');
    await editor.waitFor({ state: 'visible', timeout: 45000 });
    await page.waitForTimeout(600);
    await editor.click();
    await page.keyboard.type('First paragraph');
    await page.keyboard.press('Enter');
    await page.keyboard.type('Second paragraph');
    await page.waitForTimeout(300);
    await page.locator('.bn-block-content').first().click();
    await page.locator('.bn-side-menu').first().waitFor({ state: 'visible', timeout: 5000 });
    await page.waitForTimeout(300);
    const liveButton = page.getByRole('button', { name: 'Add block' }).first();
    const buttonInfo = await liveButton.evaluate(el => ({ reactProps: Object.keys(el).filter(k => k.startsWith('__reactProps$')).length, tabIndex: el.tabIndex }));
    await liveButton.focus();
    await page.keyboard.press(key);
    await page.waitForTimeout(350);
    return { key, buttonInfo, suggestionMenus: await page.evaluate(() => document.querySelectorAll('.bn-suggestion-menu, [role="listbox"]').length), active: await page.evaluate(() => document.activeElement?.getAttribute('aria-label') || document.activeElement?.id || document.activeElement?.tagName) };
  } finally { await page.close(); }
}
try {
  const result = { side: port === 5173 ? 'before' : 'after', port, enter: await runKey('Enter'), space: await runKey('Space') };
  fs.writeFileSync(out, JSON.stringify(result, null, 2));
  console.log(JSON.stringify(result, null, 2));
} finally { await browser.close(); }
