// src/services/admin.service.ts
import apiClient from "@/lib/api-client";
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

export const adminService = {
  // === REWARDS ===
  getRewards: async () => {
    const response = await apiClient.get<{ data: AdminReward[] }>("/admin/rewards");
    return response.data;
  },
  createReward: async (data: AdminRewardInput) => {
    const response = await apiClient.post<{ success: boolean; data: AdminReward }>("/admin/rewards", data);
    return response.data;
  },
  updateReward: async (id: number, data: AdminRewardInput) => {
    const response = await apiClient.put<{ success: boolean; data: AdminReward }>(`/admin/rewards/${id}`, data);
    return response.data;
  },
  deleteReward: async (id: number) => {
    const response = await apiClient.delete<{ success: boolean }>(`/admin/rewards/${id}`);
    return response.data;
  },

  // === CATEGORIES ===
  createCategory: async (data: AdminCategoryInput) => {
    const response = await apiClient.post<{ success: boolean; data: AdminCategory }>("/admin/categories", data);
    return response.data;
  },
  updateCategory: async (id: number, data: AdminCategoryInput) => {
    const response = await apiClient.put<{ success: boolean; data: AdminCategory }>(`/admin/categories/${id}`, data);
    return response.data;
  },
  deleteCategory: async (id: number) => {
    const response = await apiClient.delete<{ success: boolean }>(`/admin/categories/${id}`);
    return response.data;
  },

  // === ANIMALS ===
  createAnimal: async (data: AdminAnimalInput) => {
    const response = await apiClient.post<{ success: boolean; data: AdminAnimal }>("/admin/animals", data);
    return response.data;
  },
  updateAnimal: async (id: number, data: AdminAnimalInput) => {
    const response = await apiClient.put<{ success: boolean; data: AdminAnimal }>(`/admin/animals/${id}`, data);
    return response.data;
  },
  deleteAnimal: async (id: number) => {
    const response = await apiClient.delete<{ success: boolean }>(`/admin/animals/${id}`);
    return response.data;
  },

  // === STAGES ===
  createStage: async (data: AdminStageInput) => {
    const response = await apiClient.post<{ success: boolean; data: AdminStage }>("/admin/stages", data);
    return response.data;
  },
  updateStage: async (id: number, data: AdminStageInput) => {
    const response = await apiClient.put<{ success: boolean; data: AdminStage }>(`/admin/stages/${id}`, data);
    return response.data;
  },
  deleteStage: async (id: number) => {
    const response = await apiClient.delete<{ success: boolean }>(`/admin/stages/${id}`);
    return response.data;
  },
};
