import { chromium } from '@playwright/test';
import fs from 'node:fs';
const browser = await chromium.launch({ headless: true });
const results = [];
for (const port of [5173, 5174]) {
  const page = await browser.newPage({ viewport: { width: 320, height: 800 } });
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
  await page.waitForTimeout(500);
  const menuShown = await page.locator('.bn-side-menu').first().isVisible().catch(() => false);
  await page.evaluate(() => document.querySelector('.bn-editor').focus());
  await page.keyboard.press('Tab');
  const active = await page.evaluate(() => ({ tag: document.activeElement?.tagName, id: document.activeElement?.id, ariaLabel: document.activeElement?.getAttribute('aria-label'), inSideMenu: Boolean(document.activeElement?.closest?.('.bn-side-menu')) }));
  await page.waitForTimeout(450);
  const later = await page.evaluate(() => ({ tag: document.activeElement?.tagName, id: document.activeElement?.id, inSideMenu: Boolean(document.activeElement?.closest?.('.bn-side-menu')) }));
  results.push({ side: port === 5173 ? 'before' : 'after', viewport: '320x800', menuShown, active, later });
  await page.close();
}
fs.writeFileSync(process.argv[2] || 'reflow-320.json', JSON.stringify(results, null, 2));
console.log(JSON.stringify(results, null, 2));
await browser.close();
