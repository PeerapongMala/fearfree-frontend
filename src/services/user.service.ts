// src/services/user.service.ts
import apiClient from "@/services/apiClient";
import {
  UserProfile,
  RedemptionHistoryItem,
  MyPlayHistoryItem,
} from "@/models/user.model";

export const userService = {
  getProfile: async () => {
    const response = await apiClient.get<{ data: UserProfile }>("/users/me");
    return response.data;
  },

  updateProfile: async (data: Partial<UserProfile>) => {
    const response = await apiClient.patch<{ data: UserProfile }>("/users/me", data);
    return response.data;
  },

  getRedemptionHistory: async () => {
    const response = await apiClient.get<{ data: RedemptionHistoryItem[] }>("/users/me/redemptions");
    return response.data;
  },

  getMyPlayHistory: async () => {
    const response = await apiClient.get<{ data: MyPlayHistoryItem[] }>("/users/play-history");
    return response.data;
  },
};
