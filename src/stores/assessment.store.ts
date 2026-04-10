// src/stores/assessment.store.ts
import { create } from "zustand";
import { AssessmentResult, Question } from "@/models/assessment.model";
import { assessmentService } from "@/services/assessment.service";

interface AssessmentState {
  questions: Question[];
  answers: Record<number, number>; // เก็บแบบ { question_id: score }
  result: AssessmentResult | null;
  isLoading: boolean;
  error: string | null;

  fetchQuestions: () => Promise<void>;
  setAnswer: (questionId: number, score: number) => void;
  submitAnswers: () => Promise<boolean>;
}

export const useAssessmentStore = create<AssessmentState>((set, get) => ({
  questions: [],
  answers: {},
  result: null, // ✅ เริ่มต้นเป็น null
  isLoading: false,
  error: null,

  fetchQuestions: async () => {
    set({ isLoading: true, error: null });
    try {
      // เรียก API จริง
      const response = await assessmentService.getQuestions();
      const questionList = Array.isArray(response.data) ? response.data : [];

      const initialAnswers: Record<number, number> = {};
      questionList.forEach((q) => {
        initialAnswers[q.id] = 5;
      });

      set({
        questions: questionList,
        answers: initialAnswers,
        isLoading: false,
      });
    } catch (err: unknown) {
      // ✅ แก้ตรงนี้: เปลี่ยน any เป็น unknown
      console.error("Error fetching questions:", err);
      set({
        isLoading: false,
        error: "ไม่สามารถดึงข้อมูลคำถามได้ กรุณาตรวจสอบการเชื่อมต่อ Server",
      });
    }
  },

  setAnswer: (questionId, score) => {
    set((state) => ({
      answers: { ...state.answers, [questionId]: score },
    }));
  },

  submitAnswers: async () => {
    const { answers } = get();
    set({ isLoading: true, error: null });

    try {
      const payloadAnswers = Object.entries(answers).map(([qId, score]) => ({
        question_id: Number(qId),
        score: score,
      }));

      // Backend derives user from JWT — no client-supplied user_id
      const response = await assessmentService.submitAssessment({
        answers: payloadAnswers,
      });

      // Backend returns: { message, fear_level, percent, description }
      const data = response as Record<string, unknown>;
      set({
        isLoading: false,
        result: {
          fear_level: (data.fear_level as string) as AssessmentResult["fear_level"],
          percent: Number(data.percent) || 0,
          description: (data.description as string) || "",
        },
      });

      return true;
    } catch (err: unknown) {
      console.error("Error submitting assessment:", err);
      set({ isLoading: false, error: "ส่งคำตอบไม่สำเร็จ" });
      return false;
    }
  },
}));
