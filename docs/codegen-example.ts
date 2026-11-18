/**
 * `npx playwright codegen https://www.saucedemo.com` командаар бичүүлсэн код.
 * Хөтөч дээр хийсэн үйлдлийг Playwright автоматаар код болгосон. Доорх кодыг
 * ӨӨРЧЛӨЛТГҮЙ хадгалсан (миний алдаатай бичсэн "standart_user" ч үлдсэн).
 *
 * tests/ хавтаст биш docs/ хавтаст байгаа тул `npx playwright test` үүнийг
 * ажиллуулахгүй. Зөвхөн өөрийн бичсэн tests/mytest.spec.ts-тэй харьцуулах зорилготой.
 * Харьцуулсан дүгнэлт: README.md → "Codegen ба Trace viewer" хэсэг.
 */
import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');
  await page.locator('[data-test="username"]').click();
  await page.locator('[data-test="username"]').fill('standart_user');
  await page.locator('[data-test="password"]').click();
  await page.locator('[data-test="password"]').fill('secret_sauce');
  await page.locator('[data-test="login-button"]').click();
  await page.locator('[data-test="login-button"]').click();
  await page.locator('[data-test="username"]').click();
  await page.locator('[data-test="username"]').fill('standard_user');
  await page.locator('[data-test="login-button"]').click();
  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
  await page.locator('[data-test="shopping-cart-link"]').click();
  await page.locator('[data-test="remove-sauce-labs-backpack"]').click();
  await page.getByRole('button', { name: 'Open Menu' }).click();
  await page.locator('[data-test="logout-sidebar-link"]').click();
});
