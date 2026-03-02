// src/services/auth.service.ts
import axios from "axios";
import { UserProfile } from "@/models/user.model";

// เรียก URL จาก Environment Variable
const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

// 1. สร้าง Interface
interface LoginData {
  username: string;
  password?: string;
}

interface RegisterData {
  username: string;
  password?: string;
  email?: string;
  full_name?: string;
  age?: number;
  confirmPassword?: string;
}

export const authService = {
  login: async (data: LoginData) => {
    const response = await axios.post<{
      message: string;
      token: string;
      user: UserProfile;
    }>(`${API_URL}/auth/login`, data);
    return response.data;
  },

  patientLogin: async (code: string) => {
    const response = await axios.post<{
      message: string;
      token: string;
      user: UserProfile;
    }>(`${API_URL}/auth/patient-login`, { code });
    return response.data;
  },

  register: async (data: RegisterData) => {
    const response = await axios.post<{
      message: string;
      user_id: number;
    }>(`${API_URL}/auth/signup`, data);
    return response.data;
  },
};
