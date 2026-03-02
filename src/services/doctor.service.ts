// src/services/doctor.service.ts
import axios from "axios";
import {
  Patient,
  CreatePatientPayload,
  CreatePatientResponse,
  PatientHistoryResponse,
  PatientTestHistoryResponse, // ✅ Import เพิ่ม
  PatientRedemptionHistoryResponse,
} from "@/models/doctor.model";
import { useAuthStore } from "@/stores/auth.store";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

const getAuthHeaders = () => {
  const token = useAuthStore.getState().token;
  return token ? { Authorization: `Bearer ${token}` } : {};
};

interface ApiResponse<T> {
  data: T;
}

export const doctorService = {
  // 1. ดึงรายชื่อผู้ป่วย
  getPatients: async () => {
    const response = await axios.get<{ data: Patient[] }>(
      `${API_URL}/doctor/patients`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  },

  // 2. สร้างผู้ป่วยใหม่
  createPatient: async (payload: CreatePatientPayload) => {
    const response = await axios.post<CreatePatientResponse>(
      `${API_URL}/doctor/patients`,
      payload,
      { headers: getAuthHeaders() }
    );
    return response.data;
  },

  // 3. ลบผู้ป่วย
  deletePatient: async (id: number) => {
    await axios.delete(`${API_URL}/doctor/patients/${id}`, {
      headers: getAuthHeaders(),
    });
  },

  // 4. ดึงประวัติการเล่น (กราฟ/เปอร์เซ็นต์)
  getPatientHistory: async (patientId: number) => {
    const response = await axios.get<{ data: PatientHistoryResponse }>(
      `${API_URL}/doctor/patients/${patientId}/history`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  },

  // 5. ✅ [เพิ่มใหม่] ดึงบันทึกการทดสอบ (Note อาการ)
  getPatientTestHistory: async (patientId: number) => {
    const response = await axios.get<{ data: PatientTestHistoryResponse }>(
      `${API_URL}/doctor/patients/${patientId}/test-history`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  },

  // 6. ดึงข้อมูลผู้ป่วยรายคน
  getPatientById: async (patientId: number) => {
    const response = await axios.get<{ data: Patient }>(
      `${API_URL}/doctor/patients/${patientId}`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  },

  // 7. ✅ [เพิ่มใหม่] ดึงประวัติการแลกของรางวัล
  getPatientRedemptions: async (patientId: number) => {
    const response = await axios.get<{ data: PatientRedemptionHistoryResponse }>(
      `${API_URL}/doctor/patients/${patientId}/redemptions`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  },
};
