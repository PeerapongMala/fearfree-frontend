// src/services/game.service.ts
import apiClient from "@/services/apiClient";
import {
  GameCategory,
  Animal,
  StageStatus,
  GameRules,
  StageDetail,
  StageSubmissionResponse,
} from "@/models/game.model";

interface ApiResponse<T> {
  data: T;
}

export const gameService = {
  getCategories: async (): Promise<ApiResponse<GameCategory[]>> => {
    const response = await apiClient.get("/stages/categories");
    return response.data;
  },

  getAnimalsByCategory: async (categoryId: number): Promise<ApiResponse<Animal[]>> => {
    const response = await apiClient.get(`/stages/categories/${categoryId}/animals`);
    return response.data;
  },

  getAnimalById: async (id: number): Promise<ApiResponse<Animal>> => {
    const response = await apiClient.get(`/game/animals/${id}`);
    return response.data;
  },

  getStageProgress: async (animalId: number): Promise<ApiResponse<StageStatus[]>> => {
    const response = await apiClient.get(`/stages/animals/${animalId}/levels`);
    return response.data;
  },

  getGameRules: async (): Promise<ApiResponse<GameRules>> => {
    const response = await apiClient.get("/game-configs");
    return response.data;
  },

  getStageDetail: async (levelId: number): Promise<ApiResponse<StageDetail>> => {
    const response = await apiClient.get(`/stages/levels/${levelId}`);
    return response.data;
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
