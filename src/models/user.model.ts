// src/models/user.model.ts

export type UserRole = "doctor" | "patient" | "admin";

export interface UserProfile {
  id: number;
  role: UserRole;
  full_name: string;
  email: string;
  avatar_url?: string;
  age?: number;
  hospital_name?: string;
  most_fear_animal?: string;
  coins?: number;
  fear_percentage?: number;
  fear_level_text?: string;
}

// ✅ [เพิ่มใหม่] ประวัติการแลกรางวัล
export interface RedemptionHistoryItem {
  id: number;
  date: string; // เช่น '14 Aug 2025'
  reward_name: string; // เช่น 'ส่วนลดค่ารักษา'
  coins_used: number; // เช่น 30
  status: "success" | "pending" | "failed"; // เช่น 'success'
}

// ✅ [เพิ่มใหม่] ประวัติการเล่นของฉัน
export interface MyPlayHistoryItem {
  animal_name: string; // เช่น 'งู'
  progress_percent: number; // เช่น 100
}
