import { chromium } from '@playwright/test';
import fs from 'node:fs';
const port = Number(process.argv[2]);
const out = process.argv[3];
const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 840 } });
  await page.goto(`http://127.0.0.1:${port}/basic/minimal?hideMenu`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  const editor = page.locator('.bn-editor');
  await editor.waitFor({ state: 'visible', timeout: 45000 });
  await page.waitForTimeout(600);
  await page.evaluate(() => {
    const container = document.querySelector('.bn-container');
    const parent = container.parentElement;
    const before = document.createElement('button'); before.id = 'before-editor'; before.textContent = 'Before';
    const after = document.createElement('button'); after.id = 'after-editor'; after.textContent = 'After';
    parent.insertBefore(before, container);
    parent.insertBefore(after, container.nextSibling);
  });
  await editor.click();
  await page.keyboard.type('First paragraph');
  await page.keyboard.press('Enter');
  await page.keyboard.type('Second paragraph');
  await page.waitForTimeout(300);
  await page.locator('.bn-block-content').first().click();
  await page.locator('.bn-side-menu').first().waitFor({ state: 'visible', timeout: 5000 });
  await page.waitForTimeout(500);
  await page.evaluate(() => document.getElementById('after-editor').focus());
  await page.keyboard.press('Shift+Tab');
  await page.keyboard.press('Shift+Tab');
  const active = await page.evaluate(() => {
    const el = document.activeElement;
    return { tag: el?.tagName, id: el?.id, ariaLabel: el?.getAttribute('aria-label'), inSideMenu: Boolean(el?.closest?.('.bn-side-menu')), reactProps: el ? Object.keys(el).filter(k => k.startsWith('__reactProps$')).length : 0 };
  });
  await page.keyboard.press('Enter');
  await page.waitForTimeout(400);
  const afterEnter = await page.evaluate(() => ({ suggestionMenus: document.querySelectorAll('.bn-suggestion-menu, [role="listbox"]').length, active: document.activeElement?.tagName }));
  const result = { side: port === 5173 ? 'before' : 'after', active, afterEnter };
  fs.writeFileSync(out, JSON.stringify(result, null, 2));
  console.log(JSON.stringify(result, null, 2));
} finally { await browser.close(); }
