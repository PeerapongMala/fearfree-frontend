import { test, expect } from "@playwright/test";
import { setupAuthAndGo } from "./helpers/mock-auth";

test.describe("Game Flow (Patient)", () => {
  test("game categories page loads for authenticated patient", async ({ page }) => {
    await setupAuthAndGo(page, "patient", "/game/categories");
    // Page should not redirect — auth is valid
    await expect(page).toHaveURL(/\/game\/categories/);
  });

  test("stage selection page loads", async ({ page }) => {
    await setupAuthAndGo(page, "patient", "/game/play/stage/1");
    await expect(page).toHaveURL(/\/game\/play\/stage\/1/);
  });
});
