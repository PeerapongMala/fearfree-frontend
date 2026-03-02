// src/services/admin.service.ts

import axios from "axios";
import { useAuthStore } from "@/stores/auth.store";
import {
  AdminReward,
  AdminRewardInput,
  AdminCategory,
  AdminCategoryInput,
  AdminAnimal,
  AdminAnimalInput,
  AdminStage,
  AdminStageInput,
} from "@/models/admin.model";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

const getAuthHeaders = () => {
  const token = useAuthStore.getState().token;
  return {
    Authorization: `Bearer ${token}`,
  };
};

export const adminService = {
  // === REWARDS ===
  getRewards: async () => {
    const response = await axios.get<{ data: AdminReward[] }>(
      `${API_URL}/admin/rewards`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  },
  createReward: async (data: AdminRewardInput) => {
    const response = await axios.post<{ success: boolean; data: AdminReward }>(
      `${API_URL}/admin/rewards`,
      data,
      { headers: getAuthHeaders() }
    );
    return response.data;
  },
  updateReward: async (id: number, data: AdminRewardInput) => {
    const response = await axios.put<{ success: boolean; data: AdminReward }>(
      `${API_URL}/admin/rewards/${id}`,
      data,
      { headers: getAuthHeaders() }
    );
    return response.data;
  },
  deleteReward: async (id: number) => {
    const response = await axios.delete<{ success: boolean }>(
      `${API_URL}/admin/rewards/${id}`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  },

  // === CATEGORIES ===
  createCategory: async (data: AdminCategoryInput) => {
    const response = await axios.post<{ success: boolean; data: AdminCategory }>(
      `${API_URL}/admin/categories`,
      data,
      { headers: getAuthHeaders() }
    );
    return response.data;
  },
  updateCategory: async (id: number, data: AdminCategoryInput) => {
    const response = await axios.put<{ success: boolean; data: AdminCategory }>(
      `${API_URL}/admin/categories/${id}`,
      data,
      { headers: getAuthHeaders() }
    );
    return response.data;
  },
  deleteCategory: async (id: number) => {
    const response = await axios.delete<{ success: boolean }>(
      `${API_URL}/admin/categories/${id}`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  },

  // === ANIMALS ===
  createAnimal: async (data: AdminAnimalInput) => {
    const response = await axios.post<{ success: boolean; data: AdminAnimal }>(
      `${API_URL}/admin/animals`,
      data,
      { headers: getAuthHeaders() }
    );
    return response.data;
  },
  updateAnimal: async (id: number, data: AdminAnimalInput) => {
    const response = await axios.put<{ success: boolean; data: AdminAnimal }>(
      `${API_URL}/admin/animals/${id}`,
      data,
      { headers: getAuthHeaders() }
    );
    return response.data;
  },
  deleteAnimal: async (id: number) => {
    const response = await axios.delete<{ success: boolean }>(
      `${API_URL}/admin/animals/${id}`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  },

  // === STAGES ===
  createStage: async (data: AdminStageInput) => {
    const response = await axios.post<{ success: boolean; data: AdminStage }>(
      `${API_URL}/admin/stages`,
      data,
      { headers: getAuthHeaders() }
    );
    return response.data;
  },
  updateStage: async (id: number, data: AdminStageInput) => {
    const response = await axios.put<{ success: boolean; data: AdminStage }>(
      `${API_URL}/admin/stages/${id}`,
      data,
      { headers: getAuthHeaders() }
    );
    return response.data;
  },
  deleteStage: async (id: number) => {
    const response = await axios.delete<{ success: boolean }>(
      `${API_URL}/admin/stages/${id}`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  },
};
