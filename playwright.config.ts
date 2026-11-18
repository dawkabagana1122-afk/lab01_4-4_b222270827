import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright-ийн тохиргоо.
 * Дэлгэрэнгүй: https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  // Тестийн файлууд байрлах хавтас
  testDir: './tests',

  // Тестүүдийг зэрэг (parallel) ажиллуулна. Тест бүр өөрийн browser context-тэй
  // тул бие биедээ нөлөөлөхгүй (test isolation).
  fullyParallel: true,

  // CI орчинд test.only мартагдсан бол алдаа өгнө
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  // Терминал дээр жагсаалтаар, мөн HTML тайлан үүсгэнэ (npx playwright show-report)
  reporter: [['list'], ['html', { open: 'never' }]],

  use: {
    // Бүх page.goto('/') нь энэ хаягаас эхэлнэ
    baseURL: 'https://www.saucedemo.com',

    // saucedemo элементүүддээ data-testid биш data-test attribute ашигладаг тул
    // getByTestId() энэ attribute-аар хайхаар тохируулна
    testIdAttribute: 'data-test',

    // Тест бүрийн trace (алхам бүрийн DOM snapshot, сүлжээ, лог) болон
    // дүрс бичлэгийг хадгална — тайланд хавсаргахад хэрэгтэй
    trace: 'on',
    video: 'on',
    screenshot: 'only-on-failure',
  },

  // Гурван үндсэн хөтөч дээр ажиллуулна
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});
