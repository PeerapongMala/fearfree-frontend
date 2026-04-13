import { test, expect } from "@playwright/test";
import { setupAuthAndGo } from "./helpers/mock-auth";

test.describe("Admin Dashboard", () => {
  test("shows welcome message", async ({ page }) => {
    await setupAuthAndGo(page, "admin", "/admin/dashboard");
    await expect(page.getByRole("heading", { name: /ยินดีต้อนรับ/ })).toBeVisible({ timeout: 10000 });
  });

  test("shows quick action links", async ({ page }) => {
    await setupAuthAndGo(page, "admin", "/admin/dashboard");
    await expect(page.getByRole("heading", { name: "จัดการของรางวัล" })).toBeVisible({ timeout: 10000 });
  });

  test("rewards page shows table", async ({ page }) => {
    await setupAuthAndGo(page, "admin", "/admin/rewards");
    await expect(page.getByText("ตุ๊กตาหมี")).toBeVisible({ timeout: 10000 });
  });

  test("clicking add reward opens modal", async ({ page }) => {
    await setupAuthAndGo(page, "admin", "/admin/rewards");
    await expect(page.getByText("เพิ่มของรางวัล")).toBeVisible({ timeout: 10000 });
    await page.getByRole("button", { name: /เพิ่มของรางวัล/ }).click();
    await expect(page.getByRole("heading", { name: "เพิ่มของรางวัลใหม่" })).toBeVisible({ timeout: 5000 });
  });

  test("games page shows add category button", async ({ page }) => {
    await setupAuthAndGo(page, "admin", "/admin/games");
    await expect(page.getByRole("heading", { name: "จัดการเนื้อหาเกม" })).toBeVisible({ timeout: 10000 });
  });

  test("clicking add category opens modal", async ({ page }) => {
    await setupAuthAndGo(page, "admin", "/admin/games");
    await expect(page.getByRole("heading", { name: "จัดการเนื้อหาเกม" })).toBeVisible({ timeout: 10000 });
    await page.getByRole("button", { name: /เพิ่มหมวดหมู่/ }).click();
    await expect(page.getByRole("heading", { name: "เพิ่มหมวดหมู่" })).toBeVisible({ timeout: 5000 });
  });

  test("sidebar navigation works", async ({ page }) => {
    await setupAuthAndGo(page, "admin", "/admin/dashboard");
    await page.getByRole("link", { name: "จัดการของรางวัล" }).first().click();
    await expect(page).toHaveURL(/\/admin\/rewards/);
  });
});
