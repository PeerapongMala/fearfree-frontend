// src/models/user.model.ts

export type UserRole = "doctor" | "patient" | "admin";

export interface UserProfile {
  id: number;
  role: UserRole;
  full_name: string;
  email: string;
  avatar_url?: string;

  // ข้อมูลเฉพาะ (Optional)
  age?: number;
  hospital_name?: string; // ใช้ได้ทั้งหมอ (สังกัด) และผู้ป่วย (รักษาที่ไหน)

  // เฉพาะผู้ป่วย (Patient Fields)
  most_fear_animal?: string;
  coins?: number;
  fear_percentage?: number; // เช่น 60
  fear_level_text?: string; // เช่น "ระดับปานกลาง"
}
