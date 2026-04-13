import { test, expect } from "@playwright/test";
import { setupAuthAndGo } from "./helpers/mock-auth";

test.describe("Rewards Page (Patient)", () => {
  test("shows reward list", async ({ page }) => {
    await setupAuthAndGo(page, "patient", "/rewards");
    await expect(page.getByRole("heading", { name: "แลกของรางวัล" })).toBeVisible({ timeout: 10000 });
    await expect(page.getByText("ตุ๊กตาหมี")).toBeVisible();
  });

  test("shows coin balance section", async ({ page }) => {
    await setupAuthAndGo(page, "patient", "/rewards");
    await expect(page.getByText("คอยน์ของฉัน")).toBeVisible({ timeout: 10000 });
  });
});
