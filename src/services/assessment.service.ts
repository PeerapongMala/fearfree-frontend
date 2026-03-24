// src/services/assessment.service.ts
import apiClient from "@/services/apiClient";
import { Question, AssessmentSubmitPayload } from "@/models/assessment.model";

export const assessmentService = {
  getQuestions: async () => {
    const response = await apiClient.get<{ data: Question[] }>("/assessments/questions");
    return response.data;
  },

  submitAssessment: async (payload: AssessmentSubmitPayload) => {
    const response = await apiClient.post("/assessments/results", payload);
    return response.data;
  },
};
