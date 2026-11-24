import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/a11y',
  timeout: 120000,
  expect: { timeout: 15000 },
  fullyParallel: false,
  workers: 1,
  reporter: [
    ['list'],
    ['json', { outputFile: 'reports/a11y/playwright-results.json' }],
  ],
  use: {
    baseURL: 'http://127.0.0.1:8130',
    headless: true,
    viewport: { width: 1280, height: 900 },
    acceptDownloads: true,
  },
  webServer: {
    command: 'node tests/a11y/serve-site.mjs',
    url: 'http://127.0.0.1:8130',
    reuseExistingServer: true,
    timeout: 60000,
  },
});
