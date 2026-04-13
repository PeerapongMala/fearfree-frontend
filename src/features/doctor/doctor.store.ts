// src/features/doctor/doctor.store.ts
import { create } from "zustand";
import {
  Patient,
  CreatePatientPayload,
  PlayHistoryItem,
  TestHistoryItem, // ✅ Import เพิ่ม
  RedemptionHistoryItem,
} from "./doctor.model";
import { doctorService } from "./doctor.service";
import toast from "react-hot-toast";
import { logger } from "@/shared/lib/logger";

interface DoctorState {
  patients: Patient[];
  recentCreated: Patient[];
  isLoading: boolean;

  // State สำหรับหน้าประวัติการเล่น (Play History)
  selectedPatient: Patient | null;
  currentHistory: PlayHistoryItem[];

  // ✅ [เพิ่มใหม่] State สำหรับหน้าบันทึกการทดสอบ (Test History)
  currentTestHistory: TestHistoryItem[];

  // ✅ [เพิ่มใหม่] State สำหรับหน้าประวัติการแลกรางวัล
  currentRedemptions: RedemptionHistoryItem[];

  // Actions
  fetchPatients: () => Promise<void>;
  createPatient: (payload: CreatePatientPayload) => Promise<boolean>;
  deletePatient: (id: number) => Promise<void>;
  fetchPatientHistory: (patientId: number) => Promise<void>;

  // ✅ [เพิ่มใหม่] Action ดึงบันทึกการทดสอบ
  fetchPatientTestHistory: (patientId: number) => Promise<void>;

  // ✅ Action ดึงประวัติการแลกรางวัล
  fetchPatientRedemptions: (patientId: number) => Promise<void>;
}

export const useDoctorStore = create<DoctorState>((set, get) => ({
  patients: [],
  recentCreated: [],
  isLoading: false,
  selectedPatient: null,
  currentHistory: [],
  currentTestHistory: [], // Init empty
  currentRedemptions: [],

  fetchPatients: async () => {
    set({ isLoading: true });
    try {
      const res = await doctorService.getPatients();
      set({ patients: res.data || [], isLoading: false });
    } catch (err) {
      logger.error("Error fetching patients", err);
      toast.error("ไม่สามารถโหลดรายชื่อผู้ป่วยได้");
      set({ patients: [], isLoading: false });
    }
  },

  createPatient: async (payload) => {
    try {
      const res = await doctorService.createPatient(payload);
      if (res.success) {
        const newPatient = res.data;
        set((state) => ({
          patients: [newPatient, ...state.patients],
          recentCreated: [newPatient, ...state.recentCreated].slice(0, 4),
        }));
        return true;
      }
      return false;
    } catch (err) {
      logger.error("Error creating patient", err);
      return false;
    }
  },

  deletePatient: async (id) => {
    const snapshot = get().patients;
    const snapshotRecent = get().recentCreated;
    // Optimistic update
    set((state) => ({
      patients: state.patients.filter((p) => p.id !== id),
      recentCreated: state.recentCreated.filter((p) => p.id !== id),
    }));
    try {
      await doctorService.deletePatient(id);
    } catch (err) {
      logger.error("Error deleting patient", err);
      // Rollback on failure
      set({ patients: snapshot, recentCreated: snapshotRecent });
      toast.error("ลบผู้ป่วยล้มเหลว กรุณาลองใหม่อีกครั้ง");
    }
  },

  fetchPatientHistory: async (patientId: number) => {
    set({ isLoading: true, selectedPatient: null, currentHistory: [] });
    try {
      const res = await doctorService.getPatientHistory(patientId);
      set({
        selectedPatient: res.data?.patient ?? null,
        currentHistory: res.data?.history ?? [],
        isLoading: false,
      });
    } catch (err) {
      logger.error("Error fetching patient history", err);
      toast.error("ไม่สามารถโหลดประวัติการเล่นได้");
      set({ selectedPatient: null, currentHistory: [], isLoading: false });
    }
  },

  // ✅ [Implementation ใหม่] ดึงบันทึกการทดสอบ
  fetchPatientTestHistory: async (patientId: number) => {
    set({ isLoading: true, selectedPatient: null, currentTestHistory: [] });
    try {
      const res = await doctorService.getPatientTestHistory(patientId);
      set({
        selectedPatient: res.data?.patient ?? null,
        currentTestHistory: res.data?.test_history ?? [],
        isLoading: false,
      });
    } catch (err) {
      logger.error("Error fetching test history", err);
      toast.error("ไม่สามารถโหลดบันทึกการทดสอบได้");
      set({ selectedPatient: null, currentTestHistory: [], isLoading: false });
    }
  },

  // ✅ [Implementation ใหม่] ดึงประวัติการแลกรางวัล
  fetchPatientRedemptions: async (patientId: number) => {
    set({ isLoading: true, selectedPatient: null, currentRedemptions: [] });
    try {
      const res = await doctorService.getPatientRedemptions(patientId);
      set({
        selectedPatient: res.data?.patient ?? null,
        currentRedemptions: res.data?.redemptions ?? [],
        isLoading: false,
      });
    } catch (err) {
      logger.error("Error fetching redemptions", err);
      toast.error("ไม่สามารถโหลดประวัติการแลกรางวัลได้");
      set({ selectedPatient: null, currentRedemptions: [], isLoading: false });
    }
  },
}));
