// src/services/user.service.ts
import axios from "axios";
import {
  UserProfile,
  RedemptionHistoryItem,
  MyPlayHistoryItem,
} from "@/models/user.model";
import { useAuthStore } from "@/stores/auth.store";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

const getAuthHeaders = () => {
  const token = useAuthStore.getState().token;
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const userService = {
  // ดึงโปรไฟล์
  getProfile: async () => {
    const response = await axios.get<{ data: UserProfile }>(
      `${API_URL}/users/profile`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  },

  // อัปเดตโปรไฟล์
  updateProfile: async (data: Partial<UserProfile>) => {
    const response = await axios.put<{ data: UserProfile }>(
      `${API_URL}/users/profile`,
      data,
      { headers: getAuthHeaders() }
    );
    return response.data;
  },

  // ✅ [เพิ่มใหม่] ประวัติการแลกรางวัล
  getRedemptionHistory: async () => {
    const response = await axios.get<{ data: RedemptionHistoryItem[] }>(
      `${API_URL}/users/redemption-history`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  },

  // ✅ [เพิ่มใหม่] ประวัติการเล่น
  getMyPlayHistory: async () => {
    const response = await axios.get<{ data: MyPlayHistoryItem[] }>(
      `${API_URL}/users/play-history`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  },
};
