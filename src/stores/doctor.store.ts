// src/stores/doctor.store.ts
import { create } from "zustand";
import {
  Patient,
  CreatePatientPayload,
  PlayHistoryItem,
  TestHistoryItem, // ✅ Import เพิ่ม
  RedemptionHistoryItem,
} from "@/models/doctor.model";
import { doctorService } from "@/services/doctor.service";

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
      console.log("Using Mock Data for Patients");
      set({
        patients: [
          {
            id: 1,
            full_name: "พีระพงษ์ นามสมมติ",
            fear_level: "ปานกลาง",
            most_fear_animal: "จระเข้",
            code_patient: "CHBCD0001",
            created_at: "14 Aug 2025",
          },
          {
            id: 2,
            full_name: "สมชาย ใจดี",
            fear_level: "สูง",
            most_fear_animal: "งู",
            code_patient: "CHBCD0002",
            created_at: "14 Aug 2025",
          },
          {
            id: 3,
            full_name: "สมหญิง รักเรียน",
            fear_level: "ต่ำ",
            most_fear_animal: "แมงมุม",
            code_patient: "CHBCD0003",
            created_at: "13 Aug 2025",
          },
        ],
        recentCreated: [
          {
            id: 1,
            full_name: "พีระพงษ์ นามสมมติ",
            fear_level: "ปานกลาง",
            most_fear_animal: "จระเข้",
            code_patient: "CHBCD0001",
            created_at: "14 Aug 2025",
          },
        ],
        isLoading: false,
      });
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
      console.error("Error creating patient", err);
      return false;
    }
  },

  deletePatient: async (id) => {
    try {
      await doctorService.deletePatient(id);
      set((state) => ({
        patients: state.patients.filter((p) => p.id !== id),
      }));
    } catch (err) {
      set((state) => ({
        patients: state.patients.filter((p) => p.id !== id),
      }));
    }
  },

  fetchPatientHistory: async (patientId: number) => {
    set({ isLoading: true, selectedPatient: null, currentHistory: [] });
    try {
      const res = await doctorService.getPatientHistory(patientId);
      if (res.data) {
        set({
          selectedPatient: res.data.patient,
          currentHistory: res.data.history,
          isLoading: false,
        });
      }
    } catch (err) {
      console.log("Using Mock Data for History");
      const foundPatient =
        get().patients.find((p) => p.id === patientId) ||
        ({
          id: patientId,
          full_name: "พีระพงษ์ มาลา",
          code_patient: "CHBCD0001",
          fear_level: "สูง",
          most_fear_animal: "งู",
          created_at: "-",
        } as Patient);

      set({
        selectedPatient: foundPatient,
        currentHistory: [
          { animal_name: "งู", progress_percent: 100 },
          { animal_name: "แมว", progress_percent: 100 },
          { animal_name: "มด", progress_percent: 100 },
          { animal_name: "แมงมุม", progress_percent: 100 },
        ],
        isLoading: false,
      });
    }
  },

  // ✅ [Implementation ใหม่] ดึงบันทึกการทดสอบ
  fetchPatientTestHistory: async (patientId: number) => {
    set({ isLoading: true, selectedPatient: null, currentTestHistory: [] });
    try {
      const res = await doctorService.getPatientTestHistory(patientId);
      if (res.data) {
        set({
          selectedPatient: res.data.patient,
          currentTestHistory: res.data.test_history,
          isLoading: false,
        });
      }
    } catch (err) {
      console.log("Using Mock Data for Test History");

      const foundPatient =
        get().patients.find((p) => p.id === patientId) ||
        ({
          id: patientId,
          full_name: "พีระพงษ์ มาลา",
          code_patient: "CHBCD0001",
          fear_level: "สูง",
          most_fear_animal: "งู",
          created_at: "-",
        } as Patient);

      set({
        selectedPatient: foundPatient,
        currentTestHistory: [
          {
            id: 1,
            animal_name: "งู",
            stage_no: 2,
            symptom_note: "รู้สึกกลัวนิดหน่อย",
          },
          {
            id: 2,
            animal_name: "แมว",
            stage_no: 2,
            symptom_note: "รู้สึกกลัวนิดหน่อย",
          },
          {
            id: 3,
            animal_name: "งู",
            stage_no: 1,
            symptom_note: "รู้สึกกลัวนิดหน่อย",
          },
          {
            id: 4,
            animal_name: "แมว",
            stage_no: 1,
            symptom_note: "รู้สึกกลัวนิดหน่อย",
          },
        ],
        isLoading: false,
      });
    }
  },

  // ✅ [Implementation ใหม่] ดึงประวัติการแลกรางวัล
  fetchPatientRedemptions: async (patientId: number) => {
    set({ isLoading: true, selectedPatient: null, currentRedemptions: [] });
    try {
      const res = await doctorService.getPatientRedemptions(patientId);
      if (res.data) {
        set({
          selectedPatient: res.data.patient,
          currentRedemptions: res.data.redemptions,
          isLoading: false,
        });
      }
    } catch (err) {
      console.log("Using Mock Data for Redemptions");
      const foundPatient =
        get().patients.find((p) => p.id === patientId) ||
        ({
          id: patientId,
          full_name: "พีระพงษ์ มาลา",
          code_patient: "CHBCD0001",
          fear_level: "สูง",
          most_fear_animal: "งู",
          created_at: "-",
        } as Patient);

      set({
        selectedPatient: foundPatient,
        currentRedemptions: [
          {
            id: 1,
            date: "14 Aug 2025",
            reward_name: "ส่วนลด 10 บาท",
            coins_used: 30,
            status: "success",
          },
        ],
        isLoading: false,
      });
    }
  },
}));
