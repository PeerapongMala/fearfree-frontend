import { test, expect } from "@playwright/test";
import { setupAuthAndGo } from "./helpers/mock-auth";

test.describe("Assessment Flow (Patient)", () => {
  test("shows assessment form for logged-in patient", async ({ page }) => {
    await setupAuthAndGo(page, "patient", "/assessment");
    await expect(page.getByRole("heading", { name: "กรอกข้อมูล" })).toBeVisible({ timeout: 10000 });
  });

  test("questions page shows questions from API", async ({ page }) => {
    await setupAuthAndGo(page, "patient", "/assessment/questions");
    await expect(page.getByRole("heading", { name: "ประเมินระดับความกลัว" })).toBeVisible({ timeout: 10000 });
    await expect(page.getByText("เมื่อเห็นสัตว์ที่กลัว")).toBeVisible();
  });

  test("can submit answers and see result", async ({ page }) => {
    await setupAuthAndGo(page, "patient", "/assessment/questions");
    await expect(page.getByRole("heading", { name: "ประเมินระดับความกลัว" })).toBeVisible({ timeout: 10000 });
    await page.getByRole("button", { name: "เสร็จสิ้น" }).click();
    await expect(page).toHaveURL(/\/assessment\/result/, { timeout: 10000 });
  });
});
