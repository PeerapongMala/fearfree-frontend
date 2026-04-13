// src/features/assessment/assessment.service.ts
import apiClient from "@/shared/lib/api-client";
import { Question, AssessmentSubmitPayload } from "./assessment.model";

export const assessmentService = {
  getQuestions: async () => {
    const response = await apiClient.get<{ data: Question[] }>("/assessments/questions");
    return response.data;
  },

  submitAssessment: async (payload: AssessmentSubmitPayload) => {
    const response = await apiClient.post<{
      success: boolean;
      message?: string;
      data: {
        fear_level: string;
        percent: number;
        description?: string;
      };
    }>("/assessments/results", payload);
    return response.data.data;
  },
};
