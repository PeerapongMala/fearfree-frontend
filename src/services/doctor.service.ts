// src/services/doctor.service.ts
import apiClient from "@/lib/api-client";
import {
  Patient,
  CreatePatientPayload,
  CreatePatientResponse,
  PatientHistoryResponse,
  PatientTestHistoryResponse,
  PatientRedemptionHistoryResponse,
} from "@/models/doctor.model";

export const doctorService = {
  getPatients: async () => {
    const response = await apiClient.get<{ data: Patient[] }>("/doctor/patients");
    return response.data;
  },

  createPatient: async (payload: CreatePatientPayload) => {
    const response = await apiClient.post<CreatePatientResponse>("/doctor/patients", payload);
    return response.data;
  },

  deletePatient: async (id: number) => {
    await apiClient.delete(`/doctor/patients/${id}`);
  },

  getPatientHistory: async (patientId: number) => {
    const response = await apiClient.get<{ data: PatientHistoryResponse }>(`/doctor/patients/${patientId}/history`);
    return response.data;
  },

  getPatientTestHistory: async (patientId: number) => {
    const response = await apiClient.get<{ data: PatientTestHistoryResponse }>(`/doctor/patients/${patientId}/test-history`);
    return response.data;
  },

  getPatientRedemptions: async (patientId: number) => {
    const response = await apiClient.get<{ data: PatientRedemptionHistoryResponse }>(`/doctor/patients/${patientId}/redemptions`);
    return response.data;
  },
};
