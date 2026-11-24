import { test, expect } from '@playwright/test';
import { saveEvidence } from './helpers.mjs';

const framePath = {
  before: 'before/index.html',
  both: 'after/index.html',
  inert: 'after-inert/index.html',
  activation: 'after-activation/index.html',
};

async function loadComparator(page, variant = 'both') {
  await page.goto(`/#issue=2854&variant=${variant}`, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => document.querySelector('#issue-title')?.textContent.startsWith('#2854 —'));
  for (const side of ['before', 'after']) {
    const frame = page.frames().find((candidate) => candidate.url().includes(`${side}/index.html`) || candidate.url().includes(`${side}-inert/index.html`) || candidate.url().includes(`${side}-activation/index.html`));
    if (frame) await frame.locator('.bn-editor').waitFor({ state: 'visible', timeout: 30000 });
  }
  await page.waitForTimeout(600);
}

function findFrame(page, variant, side) {
  const wanted = side === 'before' ? framePath.before : framePath[variant];
  const frame = page.frames().find((candidate) => candidate.url().includes(wanted));
  if (!frame) throw new Error(`Missing ${side} frame for variant ${variant}: ${wanted}`);
  return frame;
}

async function tabFromEditor(page, frame) {
  await frame.locator('.bn-block-content').first().click();
  await frame.locator('.bn-side-menu').first().waitFor({ state: 'visible', timeout: 10000 });
  await frame.evaluate(() => document.querySelector('.bn-editor').focus());
  await page.waitForTimeout(200);
  await page.keyboard.press('Tab');
  await page.waitForTimeout(100);
  const immediate = await frame.evaluate(() => {
    const active = document.activeElement;
    return {
      tag: active?.tagName,
      label: active?.getAttribute?.('aria-label'),
      inSideMenu: Boolean(active?.closest?.('.bn-side-menu')),
      reactProps: active ? Object.keys(active).filter((key) => key.startsWith('__reactProps$')).length : 0,
    };
  });
  const parentImmediate = await page.evaluate(() => {
    const active = document.activeElement;
    return { tag: active?.tagName, id: active?.id };
  });
  await page.waitForTimeout(500);
  const later = await frame.evaluate(() => {
    const active = document.activeElement;
    return { tag: active?.tagName, label: active?.getAttribute?.('aria-label'), inSideMenu: Boolean(active?.closest?.('.bn-side-menu')) };
  });
  const parentLater = await page.evaluate(() => {
    const active = document.activeElement;
    return { tag: active?.tagName, id: active?.id };
  });
  return { immediate, parentImmediate, later, parentLater };
}

async function pressEnterOnLiveAddBlock(page, frame) {
  await frame.locator('.bn-block-content').first().click();
  await frame.locator('.bn-side-menu').first().waitFor({ state: 'visible', timeout: 10000 });
  await page.waitForTimeout(300);
  const live = await frame.evaluate(() => {
    const buttons = [...document.querySelectorAll('.bn-side-menu button')].filter((button) => button.getAttribute('aria-label') === 'Add block');
    const liveButton = buttons.find((button) => Object.keys(button).some((key) => key.startsWith('__reactProps$')));
    if (!liveButton) return false;
    liveButton.focus();
    return true;
  });
  if (!live) throw new Error('Live Add block button not found');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(400);
  return frame.evaluate(() => ({
    suggestionMenus: document.querySelectorAll('.bn-suggestion-menu, [role="listbox"]').length,
    active: document.activeElement?.getAttribute?.('aria-label') || document.activeElement?.tagName,
  }));
}

test.describe('@keyboard ATAG A.3.1.1 / A.3.1.2 — BlockNote #2854', () => {
  test('dead closing Add block clone takes focus before, not in the inert variant', async ({ page }) => {
    await loadComparator(page, 'both');

    const before = await tabFromEditor(page, findFrame(page, 'both', 'before'));
    expect(before.immediate.label).toBe('Add block');
    expect(before.immediate.inSideMenu).toBe(true);
    expect(before.immediate.reactProps).toBe(0);
    expect(before.later.tag).toBe('BODY');
    expect(before.parentLater.id).toBe('before');

    await page.selectOption('#variant', 'inert');
    await page.waitForTimeout(2500);
    const inert = await tabFromEditor(page, findFrame(page, 'inert', 'after'));
    expect(inert.immediate.inSideMenu).toBe(false);
    expect(inert.immediate.tag).toBe('BODY');
    expect(inert.parentImmediate.id).toBe('after-next');
    expect(inert.parentLater.id).toBe('after-next');

    saveEvidence('keyboard-2854.json', { before, inert });
  });

  test('Enter activates the live Add block only in the activation variant', async ({ page }) => {
    await loadComparator(page, 'activation');
    await page.selectOption('#variant', 'activation');
    await page.waitForTimeout(2500);

    const after = await pressEnterOnLiveAddBlock(page, findFrame(page, 'activation', 'after'));
    expect(after.suggestionMenus).toBeGreaterThan(0);

    await page.selectOption('#variant', 'both');
    await page.waitForTimeout(2500);
    const before = await pressEnterOnLiveAddBlock(page, findFrame(page, 'both', 'before'));
    expect(before.suggestionMenus).toBe(0);

    saveEvidence('keyboard-2854-activation.json', { after, before });
  });
});
