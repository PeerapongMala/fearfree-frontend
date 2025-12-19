// src/models/doctor.model.ts

export interface Patient {
  id: number;
  full_name: string;
  fear_level: string; // เช่น 'ปานกลาง', 'สูง'
  most_fear_animal: string; // เช่น 'งู', 'แมงมุม'
  code_patient: string; // รหัส 10 หลัก (เช่น CHBCD0001)
  created_at: string; // วันที่สร้าง (เช่น '14 Aug 2025')
}

export interface CreatePatientPayload {
  full_name: string;
  most_fear_animal: string;
}

export interface CreatePatientResponse {
  success: boolean;
  data: Patient;
}

// สำหรับหน้าประวัติการเล่น (Play History)
export interface PlayHistoryItem {
  animal_name: string;
  progress_percent: number;
}

export interface PatientHistoryResponse {
  patient: Patient;
  history: PlayHistoryItem[];
}

// ✅ [เพิ่มใหม่] สำหรับหน้าบันทึกการทดสอบ (Test History / Note)
export interface TestHistoryItem {
  id: number;
  animal_name: string; // เช่น 'งู'
  stage_no: number; // เช่น 2
  symptom_note: string; // เช่น 'รู้สึกกลัวนิดหน่อย'
  created_at?: string;
}

// ✅ [เพิ่มใหม่] Response สำหรับหน้าบันทึกการทดสอบ
export interface PatientTestHistoryResponse {
  patient: Patient;
  test_history: TestHistoryItem[];
}
