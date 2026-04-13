import { Page } from "@playwright/test";

const API_URL = "https://fearfree-backend.onrender.com/api/v1";

const users = {
  doctor: {
    id: 1, role: "doctor" as const, full_name: "Dr. Test", email: "doctor@test.com", hospital_name: "Test Hospital",
  },
  patient: {
    id: 2, role: "patient" as const, full_name: "Patient Test", email: "patient@test.com", age: 25, most_fear_animal: "งู", coins: 100, fear_percentage: 60, fear_level_text: "ปานกลาง",
  },
  admin: {
    id: 3, role: "admin" as const, full_name: "Admin Test", email: "admin@test.com",
  },
};

/** Inject auth into sessionStorage (includes token so ProtectedRoute passes) */
function injectAuth(page: Page, role: "doctor" | "patient" | "admin") {
  const user = users[role];
  return page.addInitScript((u) => {
    sessionStorage.setItem("auth-storage", JSON.stringify({
      state: { user: u, token: "test-token-123", refreshToken: "test-refresh-123" },
      version: 0,
    }));
  }, user);
}

/** Setup all API mocks */
async function setupApiMocks(page: Page) {
  await page.route(`${API_URL}/auth/login`, (r) => r.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ message: "OK", token: "test-token-123", refresh_token: "test-refresh-123", user: users.patient }) }));
  await page.route(`${API_URL}/users/profile`, (r) => r.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ data: users.patient }) }));
  await page.route(`${API_URL}/assessments/questions`, (r) => r.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ data: [{ id: 1, prompt: "เมื่อเห็นสัตว์ที่กลัว คุณรู้สึกอย่างไร?" }, { id: 2, prompt: "คุณหลีกเลี่ยงสถานที่ที่มีสัตว์บ่อยแค่ไหน?" }, { id: 3, prompt: "ความกลัวส่งผลต่อชีวิตประจำวันมากแค่ไหน?" }] }) }));
  await page.route(`${API_URL}/assessments/results`, (r) => r.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ fear_level: "medium", percent: 50, description: "ปานกลาง" }) }));
  await page.route(`${API_URL}/games/categories`, (r) => r.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ data: [{ id: 1, name: "Exposure Therapy" }] }) }));
  await page.route(`${API_URL}/games/categories/*/animals`, (r) => r.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ data: [{ id: 1, name: "งู", category_id: 1 }, { id: 2, name: "แมงมุม", category_id: 1 }] }) }));
  await page.route(`${API_URL}/games/animals/*/stages`, (r) => r.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ data: [{ id: 1, stage_no: 1, is_locked: false, is_completed: false }, { id: 2, stage_no: 2, is_locked: true, is_completed: false }] }) }));
  await page.route(`${API_URL}/games/rules`, (r) => r.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ data: { stage_duration_seconds: 10, coin_per_stage: 5 } }) }));
  await page.route(`${API_URL}/games/stages/*/submit`, (r) => r.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ success: true, earned_coins: 5, next_stage: { has_next: true, stage_no: 2, stage_id: 2 } }) }));
  await page.route(`${API_URL}/rewards`, (r) => r.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ data: [{ id: 1, name: "ตุ๊กตาหมี", image_url: "https://via.placeholder.com/150", cost_coins: 10, stock: 5 }, { id: 2, name: "สมุดระบายสี", image_url: "https://via.placeholder.com/150", cost_coins: 20, stock: 3 }] }) }));
  await page.route(`${API_URL}/rewards/*/redeem`, (r) => r.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ success: true, message: "OK", remaining_coins: 90 }) }));
  await page.route(`${API_URL}/doctor/patients`, (r) => {
    if (r.request().method() === "POST") return r.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ success: true, data: { id: 99, full_name: "New Patient", fear_level: "", most_fear_animal: "งู", code_patient: "CHBCD9999", created_at: "13 Apr 2026" } }) });
    return r.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ data: [{ id: 10, full_name: "สมชาย ใจดี", fear_level: "สูง", most_fear_animal: "งู", code_patient: "CHBCD0001", created_at: "14 Aug 2025" }] }) });
  });
  await page.route(`${API_URL}/doctor/patients/*`, (r) => {
    if (r.request().method() === "DELETE") return r.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ success: true }) });
    return r.fallback();
  });
  await page.route(`${API_URL}/admin/rewards`, (r) => r.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ data: [{ id: 1, name: "ตุ๊กตาหมี", description: "ตุ๊กตา", cost_coins: 10, stock: 5, image_url: "" }] }) }));
  await page.route(`${API_URL}/users/play-history`, (r) => r.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ data: [{ animal_name: "งู", progress_percent: 75 }] }) }));
  await page.route(`${API_URL}/users/redemption-history`, (r) => r.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ data: [{ id: 1, date: "14 Aug 2025", reward_name: "ตุ๊กตา", coins_used: 10, status: "success" }] }) }));
}

/** Full setup: inject auth + mock APIs, then goto page */
export async function setupAuthAndGo(page: Page, role: "doctor" | "patient" | "admin", url: string) {
  await injectAuth(page, role);
  await setupApiMocks(page);
  await page.goto(url);
}
