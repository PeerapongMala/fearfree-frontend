// src/features/assessment/assessment.store.ts
import { create } from "zustand";
import { AssessmentResult, Question } from "./assessment.model";
import { assessmentService } from "./assessment.service";
import { logger } from "@/shared/lib/logger";

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
      logger.error("Error fetching questions", err);
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

      set({
        isLoading: false,
        result: {
          fear_level: response.fear_level as AssessmentResult["fear_level"],
          percent: response.percent ?? 0,
          description: response.description ?? "",
        },
      });

      return true;
    } catch (err: unknown) {
      logger.error("Error submitting assessment", err);
      set({ isLoading: false, error: "ส่งคำตอบไม่สำเร็จ" });
      return false;
    }
  },
}));
