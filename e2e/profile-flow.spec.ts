import { test, expect } from "@playwright/test";
import { setupAuthAndGo } from "./helpers/mock-auth";

test.describe("Profile Page (Patient)", () => {
  test("does not redirect authenticated patient", async ({ page }) => {
    await setupAuthAndGo(page, "patient", "/profile");
    await expect(page).toHaveURL(/\/profile/);
  });
});
