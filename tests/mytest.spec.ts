import { test, expect, type Page } from '@playwright/test';

/**
 * Лаб 1 — saucedemo.com дэлгүүрийн нэвтрэх хэсгийн UI автомат тест.
 *
 * Зарчим:
 *  - Элементийг getByRole / getByPlaceholder / getByText / getByTestId зэрэг
 *    хэрэглэгчид харагдах шинжээр нь олно. XPath ашиглахгүй.
 *  - Тест бүр шинэ browser context-оор эхэлдэг тул бусад тестээс хамааралгүй
 *    (test isolation). Нэвтэрсэн тест бүр logout-оор төгсөнө.
 */

// Тестийн өгөгдөл — saucedemo нэвтрэх хуудсан дээр нээлттэй бичигдсэн байдаг
const USERNAME = 'standard_user';
const PASSWORD = 'secret_sauce';

/** Нэвтрэх формыг бөглөж Login товчийг дарна. */
async function login(page: Page, username: string, password: string) {
  await page.getByPlaceholder('Username').fill(username);
  await page.getByPlaceholder('Password').fill(password);
  await page.getByRole('button', { name: 'Login' }).click();
}

/** Хажуугийн цэсийг нээж Logout хийгээд нэвтрэх хуудас руу буцсаныг шалгана. */
async function logout(page: Page) {
  await page.getByRole('button', { name: 'Open Menu' }).click();
  // Цэсний "Logout" нь хандалтын модонд (accessibility tree) button role-той
  await page.getByRole('button', { name: 'Logout' }).click();
  // Нэвтрэх хуудас руу буцаж, Login товч дахин харагдах ёстой
  await expect(page).toHaveURL('/');
  await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
}

test.describe('Нэвтрэх', () => {
  // Тест бүрийн өмнө нэвтрэх хуудсыг шинээр ачаална
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('зөв нэр, нууц үгээр амжилттай нэвтэрнэ', async ({ page }) => {
    await login(page, USERNAME, PASSWORD);

    // Барааны жагсаалтын хуудас руу шилжсэн эсэх
    await expect(page).toHaveURL(/\/inventory\.html$/);
    // Хуудасны гарчиг "Products" харагдах ёстой (exact: true — зөвхөн яг энэ текст)
    await expect(page.getByText('Products', { exact: true })).toBeVisible();
    await expect(page.getByTestId('title')).toHaveText('Products');
    // Бараанууд харагдаж байгаа эсэх (дор хаяж нэг)
    await expect(page.getByTestId('inventory-item').first()).toBeVisible();

    await logout(page);
  });

  test('буруу нууц үгээр нэвтрэхэд алдааны мессеж гарна', async ({ page }) => {
    await login(page, USERNAME, 'buruu_nuuts_ug');

    // Алдааны мессеж нь role="alert" бүхий элемент дотор гарна
    const error = page.getByRole('alert');
    await expect(error).toBeVisible();
    await expect(error).toHaveText(
      'Epic sadface: Username and password do not match any user in this service',
    );
    // Нэвтрэх хуудсан дээрээ үлдсэн байх ёстой
    await expect(page).toHaveURL('/');
    // Нэвтрээгүй тул logout хийх шаардлагагүй
  });
});

test.describe('Нэвтэрсний дараах үйлдэл', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await login(page, USERNAME, PASSWORD);
    await expect(page).toHaveURL(/\/inventory\.html$/);
  });

  test('бараа сагсанд нэмэхэд сагсанд харагдана', async ({ page }) => {
    const productName = 'Sauce Labs Backpack';

    // Олон бараанаас зөвхөн "Sauce Labs Backpack"-ийн картыг шүүж авна
    const product = page.getByTestId('inventory-item').filter({ hasText: productName });
    await product.getByRole('button', { name: 'Add to cart' }).click();

    // Товч "Remove" болж, сагсны тоолуур 1 болсон эсэх
    await expect(product.getByRole('button', { name: 'Remove' })).toBeVisible();
    await expect(page.getByTestId('shopping-cart-badge')).toHaveText('1');

    // Сагс руу орж, бараа үнэхээр нэмэгдсэнийг шалгана
    await page.getByTestId('shopping-cart-link').click();
    await expect(page).toHaveURL(/\/cart\.html$/);
    // Сагсны жагсаалт (cart-list) дотроос хайна. Хуудас солигдох агшинд өмнөх
    // хуудасны бараанууд DOM-д түр үлддэг тул ингэж хамрах хүрээг хязгаарлахгүй
    // бол тест санамсаргүй унадаг (flaky) байсан.
    const cartItems = page.getByTestId('cart-list').getByTestId('inventory-item-name');
    await expect(cartItems).toHaveCount(1);
    await expect(cartItems).toHaveText(productName);

    await logout(page);
  });
});
