// src/services/game.service.ts
import apiClient from "@/lib/api-client";
import {
  GameCategory,
  Animal,
  StageStatus,
  GameRules,
  StageSubmissionResponse,
} from "@/models/game.model";
import { ApiResponse } from "@/models/shared.types";

export const gameService = {
  getCategories: async (): Promise<ApiResponse<GameCategory[]>> => {
    const response = await apiClient.get("/stages/categories");
    return response.data;
  },

  getAnimalsByCategory: async (categoryId: number): Promise<ApiResponse<Animal[]>> => {
    const response = await apiClient.get(`/stages/categories/${categoryId}/animals`);
    return response.data;
  },

  getStageProgress: async (animalId: number): Promise<ApiResponse<StageStatus[]>> => {
    const response = await apiClient.get(`/stages/animals/${animalId}/levels`);
    return response.data;
  },

  // Game rules: no dedicated backend endpoint exists yet.
  // Return sensible defaults until one is added.
  getGameRules: async (): Promise<ApiResponse<GameRules>> => {
    return { data: { stage_duration_seconds: 30, coin_per_stage: 10 } };
  },

  submitStageResult: async (
    levelId: number,
    isSuccess: boolean,
    note?: string
  ): Promise<StageSubmissionResponse> => {
    const response = await apiClient.post<StageSubmissionResponse>(
      `/stages/levels/${levelId}/results`,
      { answer: isSuccess ? "pass" : "fail", symptom_note: note }
    );
    return response.data;
  },
};
