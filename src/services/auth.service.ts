// src/services/auth.service.ts
import axios from "axios";
import { User } from "@/models/user.model";

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
  // 2. ใส่ Type แทน any
  login: async (data: LoginData) => {
    // console.log("Service: Login API Call", data);
    const response = await axios.post<{
      success: boolean;
      data: { token: string; user: User };
    }>(`${API_URL}/auth/login`, data);
    return response.data;
  },

  patientLogin: async (code: string) => {
    // console.log("Service: Patient Login API Call", code);
    const response = await axios.post<{
      success: boolean;
      data: { token: string; user: User };
    }>(`${API_URL}/auth/patient-login`, { code });
    return response.data;
  },

  register: async (data: RegisterData) => {
    // console.log("Service: Register API Call", data);
    const response = await axios.post(`${API_URL}/auth/register`, data);
    return response.data;
  },
};
