import { test, expect } from "@playwright/test";

test.describe("Login Select Page", () => {
  test("shows role selection options", async ({ page }) => {
    await page.goto("/login-select");
    await expect(page.getByText("บุคคลทั่วไป")).toBeVisible({ timeout: 10000 });
    await expect(page.getByText("บุคคลได้รับการรักษา")).toBeVisible();
  });

  test("clicking general option navigates to login page", async ({ page }) => {
    await page.goto("/login-select");
    await page.getByText("บุคคลทั่วไป").click();
    await expect(page).toHaveURL(/\/login$/, { timeout: 10000 });
  });

  test("clicking patient option navigates to patient login", async ({ page }) => {
    await page.goto("/login-select");
    await page.getByText("บุคคลได้รับการรักษา").click();
    await expect(page).toHaveURL(/\/login\/patient/, { timeout: 10000 });
  });
});

test.describe("Doctor Login Page", () => {
  test("shows login form", async ({ page }) => {
    await page.goto("/login");
    await expect(page.locator('input[placeholder="ชื่อผู้ใช้งาน"]')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test("shows error on empty submit", async ({ page }) => {
    await page.goto("/login");
    await page.getByRole("button", { name: /เข้าสู่ระบบ/ }).click();
    await expect(page.getByText("กรุณากรอก")).toBeVisible({ timeout: 5000 });
  });

  test("shows error on invalid credentials", async ({ page }) => {
    await page.goto("/login");
    await page.locator('input[placeholder="ชื่อผู้ใช้งาน"]').fill("wronguser");
    await page.locator('input[type="password"]').fill("wrongpassword123");
    await page.getByRole("button", { name: /เข้าสู่ระบบ/ }).click();
    await expect(page.getByText(/ไม่สำเร็จ|ผิด/)).toBeVisible({ timeout: 15000 });
  });

  test("has link to register page", async ({ page }) => {
    await page.goto("/login");
    await page.getByText("สมัครสมาชิก").click();
    await expect(page).toHaveURL(/\/register/);
  });

  test("has link to forgot password page", async ({ page }) => {
    await page.goto("/login");
    await page.getByText("ลืมรหัสผ่าน").click();
    await expect(page).toHaveURL(/\/forgot-password/);
  });
});

test.describe("Register Page", () => {
  test("shows registration form", async ({ page }) => {
    await page.goto("/register");
    await expect(page.locator('input[placeholder="ชื่อ-สกุล"]')).toBeVisible({ timeout: 15000 });
    await expect(page.locator('input[placeholder="example@gmail.com"]')).toBeVisible();
    await expect(page.locator('input[placeholder="ชื่อผู้ใช้งาน"]')).toBeVisible();
    await expect(page.locator('input[placeholder="รหัสผ่าน"]')).toBeVisible();
  });

  test("validates short username", async ({ page }) => {
    await page.goto("/register");
    await page.locator('input[placeholder="ชื่อ-สกุล"]').fill("Test User");
    await page.locator('input[placeholder="example@gmail.com"]').fill("test@test.com");
    await page.locator('input[placeholder="ชื่อผู้ใช้งาน"]').fill("ab");
    await page.locator('input[placeholder="รหัสผ่าน"]').fill("password123");
    await page.getByRole("button", { name: "สมัครสมาชิก" }).click();
    await expect(page.getByText(/อย่างน้อย 6/)).toBeVisible({ timeout: 5000 });
  });

  test("validates short password", async ({ page }) => {
    await page.goto("/register");
    await page.locator('input[placeholder="ชื่อ-สกุล"]').fill("Test User");
    await page.locator('input[placeholder="example@gmail.com"]').fill("test@test.com");
    await page.locator('input[placeholder="ชื่อผู้ใช้งาน"]').fill("testuser123");
    await page.locator('input[placeholder="รหัสผ่าน"]').fill("123");
    await page.getByRole("button", { name: "สมัครสมาชิก" }).click();
    await expect(page.getByText(/อย่างน้อย 8/)).toBeVisible({ timeout: 5000 });
  });
});

test.describe("Patient Login Page", () => {
  test("shows code input field", async ({ page }) => {
    await page.goto("/login/patient");
    await expect(page.locator("input")).toBeVisible({ timeout: 10000 });
  });

  test("shows error on invalid code", async ({ page }) => {
    await page.goto("/login/patient");
    await page.locator("input").first().fill("INVALIDCODE");
    await page.getByRole("button").first().click();
    await expect(page.getByText(/ผิด|ไม่สำเร็จ|ไม่พบ|error/i)).toBeVisible({ timeout: 15000 });
  });
});

test.describe("Forgot Password Page", () => {
  test("shows email input and submit button", async ({ page }) => {
    await page.goto("/forgot-password");
    await expect(page.locator('input[type="email"]')).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole("button", { name: "ยืนยัน" })).toBeVisible();
  });

  test("shows not-ready toast on submit", async ({ page }) => {
    await page.goto("/forgot-password");
    await page.locator('input[type="email"]').fill("test@test.com");
    await page.getByRole("button", { name: "ยืนยัน" }).click();
    await expect(page.getByText("ยังไม่พร้อม")).toBeVisible({ timeout: 5000 });
  });
});
