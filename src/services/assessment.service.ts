// src/services/assessment.service.ts
import axios from "axios";
import { Question, AssessmentSubmitPayload } from "@/models/assessment.model";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

export const assessmentService = {
  // 1. ดึงคำถาม 10 ข้อ (GET /assessments/questions)
  getQuestions: async () => {
    // ลบ Mock Data ทิ้ง แล้วยิง API
    const response = await axios.get<{ data: Question[] }>(
      `${API_URL}/assessments/questions`
    );
    return response.data;
    // Backend ต้อง return: { data: [{ id: 1, question_text: "..." }, ...] }
  },

  // 2. ส่งคำตอบ (POST /assessments/submit)
  submitAssessment: async (payload: AssessmentSubmitPayload) => {
    const response = await axios.post(`${API_URL}/assessments/submit`, payload);
    return response.data;
  },
};
