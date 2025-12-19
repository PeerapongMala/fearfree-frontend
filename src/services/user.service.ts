// src/services/user.service.ts
import axios from "axios";
import { UserProfile } from "@/models/user.model";
import { useAuthStore } from "@/stores/auth.store";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

const getAuthHeaders = () => {
  const token = useAuthStore.getState().token;
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const userService = {
  getProfile: async () => {
    const response = await axios.get<{ data: UserProfile }>(
      `${API_URL}/users/profile`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  },

  updateProfile: async (data: Partial<UserProfile>) => {
    const response = await axios.put<{ data: UserProfile }>(
      `${API_URL}/users/profile`,
      data,
      { headers: getAuthHeaders() }
    );
    return response.data;
  },
};
