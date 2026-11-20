import { test, expect, type Page } from '@playwright/test';

async function walk(page: Page, key: string, axis: 'x' | 'z', target: number, less: boolean) {
  await page.keyboard.down(key);
  try {
    await page.waitForFunction(({ axis, target, less }) => {
      const pos = window.__kidPos;
      return pos && (less ? pos[axis] < target : pos[axis] > target);
    }, { axis, target, less }, { timeout: 40000 });
  } catch (error) {
    console.log('Walk stopped', key, await page.evaluate(() => window.__kidPos));
    await page.screenshot({path: '/tmp/xiaoyuan-perf/walk-stopped.png'});
    throw error;
  } finally { await page.keyboard.up(key); }
}

test('远处模型失败时仍能穿过廊亭到后院并返回，其他模型继续补齐', async ({ page }) => {
  test.setTimeout(120000);
  const errors: string[] = [];
  const requested = new Set<string>();
  page.on('pageerror', error => errors.push(error.message));
  page.on('request', r => requested.add(new URL(r.url()).pathname.split('/').pop()!));
  // A failed building must keep its lightweight shape and not hide other props.
  await page.route('**/assets/main-house.glb*', route => route.abort());
  await page.route('**/assets/grapevine-pergola.glb*', route => route.abort());
  await page.goto('/');
  await page.getByRole('button', { name: '推门进院', exact: true }).click({ timeout: 30000 });
  await page.screenshot({ path: '/tmp/xiaoyuan-perf/streaming-entry.png' });
  await page.mouse.click(620, 300);
  await walk(page, 'KeyW', 'z', 4, true);
  await walk(page, 'KeyA', 'x', -0.6, true); // 绕开中央摇椅，仍处于门洞内
  await walk(page, 'KeyW', 'z', -7, true);
  await page.screenshot({ path: '/tmp/xiaoyuan-perf/streaming-backyard.png' });
  await walk(page, 'KeyS', 'z', 7, false);
  await expect(page.getByRole('alert')).toHaveCount(0);
  expect(errors).toEqual([]);
  expect(requested.has('inner-side-house.glb')).toBe(true);
  expect(requested.has('pump-well.glb')).toBe(true);
});

test('慢网下后台只并行两个模型，行走不等待精细资源', async ({ page }) => {
  let release!: () => void;
  const pending = new Promise<void>(resolve => { release = resolve; });
  const requested = new Set<string>();
  page.on('request', r => requested.add(new URL(r.url()).pathname.split('/').pop()!));
  for (const name of ['inner-courtyard-gate', 'grapevine-pergola']) {
    await page.route(`**/assets/${name}.glb*`, async route => {
      await pending;
      await route.continue();
    });
  }
  await page.goto('/');
  await page.getByRole('button', { name: '推门进院', exact: true }).click({ timeout: 30000 });
  await expect.poll(() => requested.has('grapevine-pergola.glb')).toBe(true);
  expect(requested.has('main-house.glb')).toBe(false);
  await page.mouse.click(620, 300);
  await walk(page, 'KeyW', 'z', 16, true);
  await page.screenshot({ path: '/tmp/xiaoyuan-perf/streaming-slow.png' });
  release();
  await expect.poll(() => requested.has('main-house.glb'), { timeout: 15000 }).toBe(true);
  await expect(page.getByRole('alert')).toHaveCount(0);
});
