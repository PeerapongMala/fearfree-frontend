// src/features/auth/auth.service.ts
import apiClient from "@/shared/lib/api-client";
import { UserProfile } from "@/shared/types";

interface LoginData {
  username: string;
  password: string;
}

interface RegisterData {
  username: string;
  password: string;
  email?: string;
  full_name?: string;
  age?: number;
}

export const authService = {
  login: async (data: LoginData) => {
    const response = await apiClient.post<{
      message: string;
      token: string;
      refresh_token: string;
      user: UserProfile;
    }>("/auth/login", data);
    return response.data;
  },

  refreshToken: async (refreshToken: string) => {
    const response = await apiClient.post<{
      token: string;
      refresh_token: string;
    }>("/auth/refresh", { refresh_token: refreshToken });
    return response.data;
  },

  // Patient login uses the same /auth/login endpoint.
  // The doctor-generated code serves as both username and password.
  patientLogin: async (code: string) => {
    const response = await apiClient.post<{
      message: string;
      token: string;
      refresh_token: string;
      user: UserProfile;
    }>("/auth/login", { username: code, password: code });
    return response.data;
  },

  register: async (data: RegisterData) => {
    const response = await apiClient.post<{
      message: string;
      user_id: number;
    }>("/auth/signup", data);
    return response.data;
  },
};
