import { test, expect } from "@playwright/test";

test.describe("Navigation Guards", () => {
  test("assessment page redirects to login when not authenticated", async ({ page }) => {
    await page.goto("/assessment");
    await expect(page).toHaveURL(/\/login-select/, { timeout: 10000 });
  });

  test("game page redirects to login when not authenticated", async ({ page }) => {
    await page.goto("/game/categories");
    await expect(page).toHaveURL(/\/login-select/, { timeout: 10000 });
  });

  test("profile page redirects to login when not authenticated", async ({ page }) => {
    await page.goto("/profile");
    await expect(page).toHaveURL(/\/login-select/, { timeout: 10000 });
  });

  test("rewards page redirects to login when not authenticated", async ({ page }) => {
    await page.goto("/rewards");
    await expect(page).toHaveURL(/\/login-select/, { timeout: 10000 });
  });

  test("doctor dashboard redirects to login when not authenticated", async ({ page }) => {
    await page.goto("/doctor/dashboard");
    await expect(page).toHaveURL(/\/login/, { timeout: 10000 });
  });

  test("admin dashboard redirects to login when not authenticated", async ({ page }) => {
    await page.goto("/admin/dashboard");
    await expect(page).toHaveURL(/\/login-select/, { timeout: 10000 });
  });
});

test.describe("Public Pages Accessible", () => {
  test("home page loads without redirect", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL("/");
  });

  test("login-select page loads", async ({ page }) => {
    await page.goto("/login-select");
    await expect(page).toHaveURL("/login-select");
  });

  test("login page loads", async ({ page }) => {
    await page.goto("/login");
    await expect(page).toHaveURL("/login");
  });

  test("register page loads", async ({ page }) => {
    await page.goto("/register");
    await expect(page).toHaveURL("/register");
  });
});
