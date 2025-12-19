// src/models/game.model.ts

export interface GameCategory {
  id: number;
  cname: string;
  is_recommended?: boolean;
}

export interface Animal {
  id: number;
  aname: string;
  category_id: number;
  is_recommended?: boolean;
}

export interface StageStatus {
  id: number;
  stage_no: number;
  is_locked: boolean;
  is_completed: boolean;
  stars?: number;
}

export interface GameRules {
  stage_duration_seconds: number;
  coin_per_stage: number;
}

export interface StageDetail {
  id: number;
  media_url: string;
  media_type: "image" | "video";
}

// ✅ [ใหม่] โครงสร้าง Response เมื่อจบด่าน
export interface StageSubmissionResponse {
  success: boolean;
  earned_coins: number; // จำนวนเหรียญที่ได้ (Backend คำนวณมาให้)
  new_balance?: number; // ยอดเหรียญล่าสุด (เผื่อเอาไปอัปเดต UI)
  next_stage?: {
    // ข้อมูลด่านถัดไป (ถ้ามี)
    has_next: boolean;
    stage_no: number;
    stage_id: number;
  };
}
