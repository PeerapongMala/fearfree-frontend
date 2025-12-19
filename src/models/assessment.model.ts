// src/models/assessment.model.ts

export interface Question {
  id: number;
  // เดิม question_text แก้เป็น prompt ตาม DB
  prompt: string;
  seq?: number; // เผื่อใช้เรียงลำดับ (ตาม DB: seq)
}

export interface AssessmentAnswer {
  question_id: number;
  score: number;
}

export interface AssessmentSubmitPayload {
  user_id: number;
  answers: AssessmentAnswer[];
}

// ผลลัพธ์ที่ Backend จะคำนวณและส่งกลับมา (อิงตาม Assessment_result)
export interface AssessmentResult {
  // ตาม DB: fear_level (Enum: low, medium, high)
  fear_level: "low" | "medium" | "high";

  // ตาม DB: percent
  percent: number;

  // สิ่งที่ Backend น่าจะส่งเพิ่มมาให้ (ไม่อยู่ใน DB แต่อยู่ใน Response)
  description?: string;
  total_score?: number;
}
