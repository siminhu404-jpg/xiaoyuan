import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './',
  build: { assetsInlineLimit: 8192 },
  // vitest 只跑单元测试；e2e/ 交给 Playwright，避免误扫进 vitest 导致加载 playwright-core 报错
  test: {
    exclude: ['**/e2e/**', '**/node_modules/**', '**/playwright.config.ts'],
  },
});