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
    const response = await axios.get(`${API_URL}/game/categories`);
    return response.data;
  },
  getAnimalsByCategory: async (
    categoryId: number
  ): Promise<ApiResponse<Animal[]>> => {
    const response = await axios.get(
      `${API_URL}/game/categories/${categoryId}/animals`
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
      `${API_URL}/game/animals/${animalId}/stages/progress`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  },
  getGameRules: async (): Promise<ApiResponse<GameRules>> => {
    const response = await axios.get(`${API_URL}/game/v1/rules`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  },
  getStageDetail: async (
    stageId: number
  ): Promise<ApiResponse<StageDetail>> => {
    const response = await axios.get(`${API_URL}/stages/v1/${stageId}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  },

  // ✅ [แก้ไข] Return เป็น StageSubmissionResponse
  submitStageResult: async (
    stageId: number,
    isSuccess: boolean,
    note?: string
  ): Promise<StageSubmissionResponse> => {
    // หมายเหตุ: Backend ควรส่งโครงสร้างกลับมาให้ตรงกับ StageSubmissionResponse
    const response = await axios.post<StageSubmissionResponse>(
      `${API_URL}/stages/v1/${stageId}/result`,
      { success: isSuccess, note: note },
      { headers: getAuthHeaders() }
    );
    return response.data;
  },
};
