import { test, expect } from '@playwright/test';
import { previewUrl, saveEvidence } from './helpers.mjs';

const modifier = process.platform === 'darwin' ? 'Meta' : 'Control';
const MAIN_MINIMAL = 'https://blocknote-git-main-typecell.vercel.app/basic/minimal';

// Upstream previews are context only: this lab does not review or approve pull requests.
test.describe('@part-a @previews — ATAG Part A coverage', () => {
  test.skip(process.env.SKIP_NETWORK === '1', 'external preview checks skipped (SKIP_NETWORK=1)');

  test('A.2.1.2: rendered video/audio have no caption track or transcript', async ({ page }) => {
    await page.goto(previewUrl(2822, 'before'), { waitUntil: 'domcontentloaded' });
    await page.locator('.bn-editor').waitFor({ state: 'visible', timeout: 30000 });
    await page.waitForTimeout(1200);

    const media = await page.evaluate(() => ({
      videos: [...document.querySelectorAll('.bn-editor video')].map((video) => ({
        src: video.getAttribute('src'),
        tracks: [...video.querySelectorAll('track')].map((track) => ({
          kind: track.kind,
          label: track.label,
          srclang: track.srclang,
        })),
        ariaLabel: video.getAttribute('aria-label'),
      })),
      audios: [...document.querySelectorAll('.bn-editor audio')].map((audio) => ({
        src: audio.getAttribute('src'),
        tracks: [...audio.querySelectorAll('track')].map((track) => ({ kind: track.kind, label: track.label })),
      })),
      captions: [...document.querySelectorAll('.bn-editor figcaption')].map((caption) => caption.innerText.trim()),
    }));

    expect(media.videos.length).toBe(1);
    expect(media.audios.length).toBe(1);
    expect(media.videos[0].tracks).toEqual([]);
    expect(media.audios[0].tracks).toEqual([]);
    expect(media.videos[0].ariaLabel).toBeNull();
    expect(media.videos[0].src).toContain('flower.webm');
    expect(media.captions.join(' ')).toContain('flower.webm');

    saveEvidence('atag-a212-media.json', media);
  });

  test('A.4.1.1: a text edit can be undone with the keyboard', async ({ page }) => {
    await page.goto(MAIN_MINIMAL, { waitUntil: 'domcontentloaded' });
    await page.locator('.bn-editor').waitFor({ state: 'visible', timeout: 30000 });
    await page.waitForTimeout(600);
    await page.locator('.bn-editor').click();
    await page.keyboard.type('Undo me');
    await page.waitForTimeout(200);

    const typed = await page.evaluate(() => document.querySelector('.bn-editor')?.innerText.trim());
    await page.keyboard.press(`${modifier}+z`);
    await page.waitForTimeout(300);
    const undone = await page.evaluate(() => document.querySelector('.bn-editor')?.innerText.trim());

    expect(typed).toContain('Undo me');
    expect(undone).toBe('');

    // Record redo where the platform supports it; it is not the pass condition.
    await page.keyboard.press(`${modifier}+Shift+z`);
    await page.waitForTimeout(300);
    const redone = await page.evaluate(() => document.querySelector('.bn-editor')?.innerText.trim());

    saveEvidence('atag-a411-undo.json', { typed, undone, redone, modifier });
  });
});
