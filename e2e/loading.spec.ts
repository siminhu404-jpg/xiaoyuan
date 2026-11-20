import { test, expect } from '@playwright/test';

test('入口准备好即可进院，远处和装饰模型不阻塞首屏', async ({ page }) => {
  const requested: string[] = [];
  page.on('request', (request) => {
    if (request.url().endsWith('.glb')) requested.push(request.url());
  });
  // A failed optional model must not be requested before the visitor enters.
  await page.route('**/assets/butterfly.glb', (route) => route.abort());
  await page.goto('/');
  await expect(page.getByRole('heading', { name: '姥姥家的小院' })).toBeVisible();
  const enter = page.getByRole('button', { name: '推门进院', exact: true });
  await expect(enter).toBeEnabled({ timeout: 30000 });
  expect(requested.some((url) => /character-with-animations\.glb$/.test(url))).toBe(true);
  expect(requested.some((url) => /outer-gate-door\.glb$/.test(url))).toBe(true);
  expect(requested.some((url) => /black-cat|butterfly|border-collie|main-house|pepper-plant/.test(url))).toBe(false);
});

test('必要模型失败时提供重试，而不是永久等待', async ({ page }) => {
  await page.route('**/assets/character-with-animations.glb', (route) => route.abort());
  await page.goto('/');
  await expect(page.getByRole('alert')).toContainText('小院暂时没能打开', { timeout: 15000 });
  await expect(page.getByRole('button', { name: '重新加载' })).toBeVisible();
});

test('人物未就绪时不能进院，就绪后可以开门并行走', async ({ page }) => {
  let release!: () => void;
  const waiting = new Promise<void>((resolve) => { release = resolve; });
  await page.route('**/assets/character-with-animations.glb', async (route) => {
    await waiting;
    await route.continue();
  });
  await page.goto('/');
  await expect(page.getByRole('button', { name: '正在准备小院…' })).toBeDisabled();
  release();
  const enter = page.getByRole('button', { name: '推门进院', exact: true });
  await expect(enter).toBeEnabled({ timeout: 30000 });
  await enter.click();
  await page.mouse.click(620, 300); // 门扇；1280 × 720 的固定测试视口
  await page.keyboard.down('KeyW');
  try {
    await expect.poll(() => page.evaluate(() => window.__kidPos?.z ?? 19.2), { timeout: 20000 }).toBeLessThan(17.5);
  } finally {
    await page.keyboard.up('KeyW');
  }
});
