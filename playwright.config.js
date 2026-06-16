import { defineConfig } from '@playwright/test';
import { existsSync } from 'node:fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const launchOptions = existsSync(chromePath) ? { executablePath: chromePath } : {};

export default defineConfig({
  testDir: './tests',
  reporter: [['list']],
  use: {
    browserName: 'chromium',
    launchOptions,
  },
});
