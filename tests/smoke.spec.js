import { expect, test } from '@playwright/test';
import { pathToFileURL } from 'node:url';

const appUrl = pathToFileURL(`${process.cwd()}/index.html`).toString();

test('mobile API key actions stay inside viewport', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto(appUrl);

  await expect(page.getByRole('link', { name: /免费获取 key/i })).toBeVisible();
  const hasOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  expect(hasOverflow).toBe(false);
});

test('video task log persists and can be cleared', async ({ page }) => {
  await page.goto(appUrl);
  await page.evaluate(() => {
    window.AgnesStudio.videoTask.setId('smoke-task-1');
    window.AgnesStudio.videoTask.show('', '任务 ID：smoke-task-1\n任务状态：smoke');
  });

  await page.reload();
  await page.getByRole('button', { name: '视频生成' }).click();
  await expect(page.locator('#vidTaskLog')).toContainText('smoke-task-1');
  await expect(page.locator('#copyVidTaskBtn')).toBeVisible();

  await page.locator('#clearVidTaskBtn').click();
  await expect(page.locator('#vidTaskLog')).toBeHidden();
  await expect(page.locator('#copyVidTaskBtn')).toBeHidden();
});

test('history clear controls are available without generated media', async ({ page }) => {
  await page.goto(appUrl);
  await expect(page.locator('#clearImgHistory')).toBeVisible();

  await page.getByRole('button', { name: '视频生成' }).click();
  await expect(page.locator('#clearVidHistory')).toBeVisible();
  await expect(page.evaluate(() => Boolean(window.AgnesStudio?.history?.clear))).resolves.toBe(true);
});
