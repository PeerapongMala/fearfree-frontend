import { test, expect } from "@playwright/test";

test.describe("Home Page", () => {
  test("loads and shows hero section", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toBeVisible({ timeout: 10000 });
    await expect(page).toHaveTitle(/FearFree/i);
  });

  test("navbar is visible with navigation links", async ({ page }) => {
    await page.goto("/");
    const nav = page.locator("nav");
    await expect(nav).toBeVisible();
    await expect(nav.getByText("หน้าหลัก")).toBeVisible();
  });

  test("clicking assessment link without login shows toast error", async ({ page }) => {
    await page.goto("/");
    await page.click('a[href="/assessment"]');
    // Should show toast error since not logged in
    await expect(page.getByText("กรุณาเข้าสู่ระบบ")).toBeVisible({ timeout: 5000 });
  });
});
