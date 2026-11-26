#!/usr/bin/env node
// Headed-only clipboard probe for ATAG B.1.2.2.
// Headless Chromium exposes only text/plain on this environment, so this is a
// manual check rather than part of the CI gate.
import { chromium } from '@playwright/test';

const preview = 'https://blocknote-git-main-typecell.vercel.app/basic/minimal';
const modifier = process.platform === 'darwin' ? 'Meta' : 'Control';
const browser = await chromium.launch({
  headless: false,
  executablePath: process.env.CHROME || undefined,
});
const context = await browser.newContext({
  permissions: ['clipboard-read', 'clipboard-write'],
  viewport: { width: 1200, height: 800 },
});
const page = await context.newPage();

try {
  await page.goto(preview, { waitUntil: 'domcontentloaded' });
  await page.locator('.bn-editor').waitFor({ state: 'visible', timeout: 30000 });
  await page.waitForTimeout(800);
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

  await page.locator('.bn-editor').click();
  for (let i = 0; i < 3; i++) await page.keyboard.press(`${modifier}+a`);
  await page.keyboard.press(`${modifier}+c`);
  await page.waitForTimeout(800);

  const items = await page.evaluate(async () => {
    const clipboardItems = await navigator.clipboard.read();
    const result = [];
    for (const item of clipboardItems) {
      for (const type of item.types) {
        const blob = await item.getType(type);
        result.push({ type, text: await blob.text() });
      }
    }
    return result;
  });

  const html = items.find((item) => item.type === 'text/html')?.text ?? '';
  const plain = items.find((item) => item.type === 'text/plain')?.text ?? '';
  const result = {
    types: items.map((item) => item.type),
    htmlHasAlt: html.includes('alt="A small cat"'),
    htmlHasList: html.includes('<ul>') && html.includes('<li>'),
    plain,
    html,
  };
  console.log(JSON.stringify(result, null, 2));
  if (!result.htmlHasAlt || !result.htmlHasList) {
    console.error('Clipboard HTML did not preserve image alt and list structure.');
    process.exitCode = 1;
  }
} finally {
  await browser.close();
}
