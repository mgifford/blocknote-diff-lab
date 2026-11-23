import { chromium } from '@playwright/test';
import fs from 'node:fs';

const browser = await chromium.launch({ headless: true });
const results = [];
try {
  for (const port of [5173, 5174]) {
    const side = port === 5173 ? 'before' : 'after';
    for (let run = 1; run <= 3; run++) {
      const context = await browser.newContext({ viewport: { width: 1280, height: 840 }, colorScheme: 'light' });
      const page = await context.newPage();
      await page.goto(`http://127.0.0.1:${port}/basic/minimal?hideMenu`, { waitUntil: 'domcontentloaded', timeout: 60000 });
      const editor = page.locator('.bn-editor');
      await editor.waitFor({ state: 'visible', timeout: 45000 });
      await page.waitForTimeout(600);
      await page.evaluate(() => {
        const container = document.querySelector('.bn-container');
        const parent = container?.parentElement;
        const before = document.createElement('button');
        before.id = 'before-editor'; before.textContent = 'Before editor';
        const after = document.createElement('button');
        after.id = 'after-editor'; after.textContent = 'After editor';
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
      await page.evaluate(() => document.querySelector('.bn-editor').focus());
      await page.waitForTimeout(150);
      const preTab = await page.evaluate(() => {
        const add = [...document.querySelectorAll('.bn-side-menu button')].find(b => b.getAttribute('aria-label') === 'Add block');
        return {
          active: document.activeElement?.className,
          activeIsEditor: document.activeElement?.classList?.contains('bn-editor'),
          liveAdd: Boolean(add && Object.keys(add).some(k => k.startsWith('__reactProps$'))),
          sideMenus: document.querySelectorAll('.bn-side-menu').length,
        };
      });
      await page.keyboard.press('Tab');
      const immediate = await page.evaluate(() => {
        const el = document.activeElement;
        return { tag: el?.tagName, id: el?.id, ariaLabel: el?.getAttribute('aria-label'), inSideMenu: Boolean(el?.closest?.('.bn-side-menu')), reactProps: el ? Object.keys(el).filter(k => k.startsWith('__reactProps$')).length : 0 };
      });
      await page.waitForTimeout(450);
      const later = await page.evaluate(() => {
        const el = document.activeElement;
        return { tag: el?.tagName, id: el?.id, ariaLabel: el?.getAttribute('aria-label'), inSideMenu: Boolean(el?.closest?.('.bn-side-menu')) };
      });
      results.push({ side, run, preTab, immediate, later });
      await context.close();
    }
  }
  fs.writeFileSync(process.argv[2] || 'focus.json', JSON.stringify(results, null, 2));
  console.log(JSON.stringify(results, null, 2));
} finally { await browser.close(); }
