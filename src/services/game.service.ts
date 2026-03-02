// src/services/game.service.ts
import axios from "axios";
import {
  GameCategory,
  Animal,
  StageStatus,
  GameRules,
  StageDetail,
  StageSubmissionResponse, // ✅ Import
} from "@/models/game.model";
import { useAuthStore } from "@/stores/auth.store";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

const getAuthHeaders = (): { Authorization?: string } => {
  const token = useAuthStore.getState().token;
  return token ? { Authorization: `Bearer ${token}` } : {};
};

interface ApiResponse<T> {
  data: T;
}

export const gameService = {
  // ... (func อื่นๆ เหมือนเดิม: getCategories, getAnimals, getRules, getStageDetail) ...

  getCategories: async (): Promise<ApiResponse<GameCategory[]>> => {
    const response = await axios.get(`${API_URL}/stages/categories`, { headers: getAuthHeaders() });
    return response.data;
  },
  getAnimalsByCategory: async (
    categoryId: number
  ): Promise<ApiResponse<Animal[]>> => {
    const response = await axios.get(
      `${API_URL}/stages/categories/${categoryId}/animals`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  },
  getAnimalById: async (id: number): Promise<ApiResponse<Animal>> => {
    const response = await axios.get(`${API_URL}/game/animals/${id}`);
    return response.data;
  },
  getStageProgress: async (
    animalId: number
  ): Promise<ApiResponse<StageStatus[]>> => {
    const response = await axios.get(
      `${API_URL}/stages/animals/${animalId}/levels`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  },
  getGameRules: async (): Promise<ApiResponse<GameRules>> => {
    const response = await axios.get(`${API_URL}/game-configs`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  },
  getStageDetail: async (
    levelId: number
  ): Promise<ApiResponse<StageDetail>> => {
    const response = await axios.get(`${API_URL}/stages/levels/${levelId}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  },

  // ✅ [แก้ไข] Return เป็น StageSubmissionResponse
  submitStageResult: async (
    levelId: number,
    isSuccess: boolean,
    note?: string
  ): Promise<StageSubmissionResponse> => {
    // หมายเหตุ: Backend ควรส่งโครงสร้างกลับมาให้ตรงกับ StageSubmissionResponse
    const response = await axios.post<StageSubmissionResponse>(
      `${API_URL}/stages/levels/${levelId}/results`,
      { answer: isSuccess ? "pass" : "fail", symptom_note: note },
      { headers: getAuthHeaders() }
    );
    return response.data;
  },
};
