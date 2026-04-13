import { test, expect } from "@playwright/test";
import { setupAuthAndGo } from "./helpers/mock-auth";

test.describe("Doctor Dashboard", () => {
  test("shows patient list", async ({ page }) => {
    await setupAuthAndGo(page, "doctor", "/doctor/dashboard");
    await expect(page.getByText("สมชาย ใจดี")).toBeVisible({ timeout: 10000 });
  });

  test("shows patient code", async ({ page }) => {
    await setupAuthAndGo(page, "doctor", "/doctor/dashboard");
    await expect(page.getByText("CHBCD0001")).toBeVisible({ timeout: 10000 });
  });

  test("create patient form is visible", async ({ page }) => {
    await setupAuthAndGo(page, "doctor", "/doctor/dashboard");
    await expect(page.locator('input[placeholder="ชื่อ-สกุล"]')).toBeVisible({ timeout: 10000 });
  });

  test("can create patient", async ({ page }) => {
    await setupAuthAndGo(page, "doctor", "/doctor/dashboard");
    await page.locator('input[placeholder="ชื่อ-สกุล"]').fill("New Patient");
    await page.locator('input[placeholder*="สัตว์"]').fill("งู");
    await page.getByRole("button", { name: /สร้างผู้ป่วย/ }).click();
    await expect(page.getByText("สร้างผู้ป่วยสำเร็จ")).toBeVisible({ timeout: 5000 });
  });
});
