import { test, expect } from '@playwright/test';
import { previewUrl, saveEvidence } from './helpers.mjs';

const modifier = process.platform === 'darwin' ? 'Meta' : 'Control';

// Upstream previews are context only: this lab does not review or approve pull requests.
test.describe('@a11yfirst @previews — A11yFirst authoring probes', () => {
  test.skip(process.env.SKIP_NETWORK === '1', 'external preview checks skipped (SKIP_NETWORK=1)');

  test('AF-01: H1 followed by H3 is accepted without a heading-level warning', async ({ page }) => {
    await page.goto(previewUrl(2822, 'before'), { waitUntil: 'domcontentloaded' });
    await page.locator('.bn-editor').waitFor({ state: 'visible', timeout: 30000 });
    await page.waitForTimeout(500);
    await page.locator('.bn-editor').click();
    await page.keyboard.press(`${modifier}+End`);
    await page.keyboard.press('Enter');
    await page.keyboard.type('# Heading one');
    await page.keyboard.press('Enter');
    await page.keyboard.type('### Heading three');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);

    const state = await page.evaluate(() => ({
      headings: [...document.querySelectorAll('.bn-editor h1, .bn-editor h2, .bn-editor h3, .bn-editor h4, .bn-editor h5, .bn-editor h6')]
        .map((heading) => ({ tag: heading.tagName, text: heading.innerText.trim().slice(0, 40) })),
      warnings: [...document.querySelectorAll('[role="alert"], [role="status"]')]
        .map((element) => element.innerText.trim())
        .filter(Boolean),
    }));

    expect(state.headings.some((heading) => heading.tag === 'H3')).toBe(true);
    expect(state.warnings.join(' ')).not.toMatch(/heading|level|skip|outline/i);
    saveEvidence('a11yfirst-01-heading-probe.json', state);
  });

  test('AF-03: "click here" link is accepted without link-text guidance', async ({ page }) => {
    await page.goto('https://blocknote-git-main-typecell.vercel.app/basic/minimal', { waitUntil: 'domcontentloaded' });
    await page.locator('.bn-editor').waitFor({ state: 'visible', timeout: 30000 });
    await page.locator('.bn-editor').click();
    await page.keyboard.press(`${modifier}+End`);
    await page.keyboard.press('Enter');
    await page.keyboard.type('click here');
    await page.keyboard.press(`${modifier}+a`);
    await page.waitForTimeout(500);

    const linkButton = page.locator('.bn-formatting-toolbar button[aria-label*="Link" i], .bn-toolbar button[aria-label*="Link" i]').first();
    await linkButton.click();
    await page.locator('input[placeholder="Edit URL"]').fill('https://example.com');
    await page.locator('input[placeholder="Edit URL"]').press('Enter');
    await page.waitForTimeout(500);

    const state = await page.evaluate(() => ({
      links: [...document.querySelectorAll('.bn-editor a')]
        .filter((anchor) => anchor.innerText.trim() === 'click here')
        .map((anchor) => ({ text: anchor.innerText.trim(), href: anchor.getAttribute('href') })),
      warnings: [...document.querySelectorAll('[role="alert"], [role="status"]')]
        .map((element) => element.innerText.trim())
        .filter(Boolean),
    }));

    expect(state.links).toContainEqual({ text: 'click here', href: 'https://example.com' });
    expect(state.warnings.join(' ')).not.toMatch(/link|text|descriptive|purpose/i);
    saveEvidence('a11yfirst-03-link-probe.json', state);
  });
});
