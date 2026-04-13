import { describe, it, expect, beforeEach, vi } from "vitest";
import { useDoctorStore } from "./doctor.store";

vi.mock("./doctor.service", () => ({
  doctorService: {
    getPatients: vi.fn(),
    createPatient: vi.fn(),
    deletePatient: vi.fn(),
    getPatientHistory: vi.fn(),
    getPatientTestHistory: vi.fn(),
    getPatientRedemptions: vi.fn(),
  },
}));

vi.mock("react-hot-toast", () => ({
  default: { error: vi.fn(), success: vi.fn() },
}));

import { doctorService } from "./doctor.service";

const mockPatient = {
  id: 1,
  full_name: "Test Patient",
  fear_level: "สูง",
  most_fear_animal: "งู",
  code_patient: "CHBCD0001",
  created_at: "14 Aug 2025",
};

describe("useDoctorStore", () => {
  beforeEach(() => {
    useDoctorStore.setState({
      patients: [],
      recentCreated: [],
      isLoading: false,
      selectedPatient: null,
      currentHistory: [],
      currentTestHistory: [],
      currentRedemptions: [],
    });
    vi.clearAllMocks();
  });

  describe("fetchPatients", () => {
    it("fetches and sets patients", async () => {
      vi.mocked(doctorService.getPatients).mockResolvedValue({
        data: [mockPatient],
      });

      await useDoctorStore.getState().fetchPatients();

      expect(useDoctorStore.getState().patients).toEqual([mockPatient]);
      expect(useDoctorStore.getState().isLoading).toBe(false);
    });

    it("sets empty array on failure", async () => {
      vi.mocked(doctorService.getPatients).mockRejectedValue(new Error("fail"));

      await useDoctorStore.getState().fetchPatients();

      expect(useDoctorStore.getState().patients).toEqual([]);
    });
  });

  describe("createPatient", () => {
    it("adds patient to list and recentCreated on success", async () => {
      vi.mocked(doctorService.createPatient).mockResolvedValue({
        success: true,
        data: mockPatient,
      });

      const result = await useDoctorStore.getState().createPatient({
        full_name: "Test",
        most_fear_animal: "งู",
      });

      expect(result).toBe(true);
      expect(useDoctorStore.getState().patients).toContainEqual(mockPatient);
      expect(useDoctorStore.getState().recentCreated).toContainEqual(mockPatient);
    });

    it("returns false on failure", async () => {
      vi.mocked(doctorService.createPatient).mockRejectedValue(new Error("fail"));

      const result = await useDoctorStore.getState().createPatient({
        full_name: "Test",
        most_fear_animal: "งู",
      });

      expect(result).toBe(false);
    });

    it("limits recentCreated to 4 items", async () => {
      useDoctorStore.setState({
        recentCreated: [
          { ...mockPatient, id: 10 },
          { ...mockPatient, id: 11 },
          { ...mockPatient, id: 12 },
          { ...mockPatient, id: 13 },
        ],
      });

      vi.mocked(doctorService.createPatient).mockResolvedValue({
        success: true,
        data: { ...mockPatient, id: 99 },
      });

      await useDoctorStore.getState().createPatient({
        full_name: "New",
        most_fear_animal: "แมงมุม",
      });

      expect(useDoctorStore.getState().recentCreated).toHaveLength(4);
      expect(useDoctorStore.getState().recentCreated[0].id).toBe(99);
    });
  });

  describe("deletePatient", () => {
    it("removes patient optimistically", async () => {
      useDoctorStore.setState({ patients: [mockPatient] });
      vi.mocked(doctorService.deletePatient).mockResolvedValue(undefined);

      await useDoctorStore.getState().deletePatient(1);

      expect(useDoctorStore.getState().patients).toEqual([]);
    });

    it("rolls back on failure", async () => {
      useDoctorStore.setState({ patients: [mockPatient] });
      vi.mocked(doctorService.deletePatient).mockRejectedValue(new Error("fail"));

      await useDoctorStore.getState().deletePatient(1);

      expect(useDoctorStore.getState().patients).toEqual([mockPatient]);
    });
  });

  describe("fetchPatientHistory", () => {
    it("sets selectedPatient and history", async () => {
      vi.mocked(doctorService.getPatientHistory).mockResolvedValue({
        data: {
          patient: mockPatient,
          history: [{ animal_name: "งู", progress_percent: 75 }],
        },
      });

      await useDoctorStore.getState().fetchPatientHistory(1);

      expect(useDoctorStore.getState().selectedPatient).toEqual(mockPatient);
      expect(useDoctorStore.getState().currentHistory).toHaveLength(1);
    });
  });

  describe("fetchPatientTestHistory", () => {
    it("sets test history", async () => {
      vi.mocked(doctorService.getPatientTestHistory).mockResolvedValue({
        data: {
          patient: mockPatient,
          test_history: [
            { id: 1, animal_name: "งู", stage_no: 1, symptom_note: "กลัวมาก" },
          ],
        },
      });

      await useDoctorStore.getState().fetchPatientTestHistory(1);

      expect(useDoctorStore.getState().currentTestHistory).toHaveLength(1);
    });
  });

  describe("fetchPatientRedemptions", () => {
    it("sets redemptions", async () => {
      vi.mocked(doctorService.getPatientRedemptions).mockResolvedValue({
        data: {
          patient: mockPatient,
          redemptions: [
            { id: 1, date: "14 Aug 2025", reward_name: "ตุ๊กตา", coins_used: 10, status: "success" as const },
          ],
        },
      });

      await useDoctorStore.getState().fetchPatientRedemptions(1);

      expect(useDoctorStore.getState().currentRedemptions).toHaveLength(1);
    });

    it("clears state on error", async () => {
      useDoctorStore.setState({
        selectedPatient: mockPatient,
        currentRedemptions: [
          { id: 1, date: "14 Aug 2025", reward_name: "ตุ๊กตา", coins_used: 10, status: "success" as const },
        ],
      });
      vi.mocked(doctorService.getPatientRedemptions).mockRejectedValue(new Error("fail"));

      await useDoctorStore.getState().fetchPatientRedemptions(1);

      expect(useDoctorStore.getState().selectedPatient).toBeNull();
      expect(useDoctorStore.getState().currentRedemptions).toEqual([]);
      expect(useDoctorStore.getState().isLoading).toBe(false);
    });
  });

  describe("createPatient — success false", () => {
    it("returns false when API returns success: false", async () => {
      vi.mocked(doctorService.createPatient).mockResolvedValue({
        success: false,
        data: mockPatient,
      });

      const result = await useDoctorStore.getState().createPatient({
        full_name: "Test",
        most_fear_animal: "งู",
      });

      expect(result).toBe(false);
      expect(useDoctorStore.getState().patients).toEqual([]);
    });
  });

  describe("deletePatient — rollback restores recentCreated", () => {
    it("rolls back both patients and recentCreated on failure", async () => {
      useDoctorStore.setState({
        patients: [mockPatient],
        recentCreated: [mockPatient],
      });
      vi.mocked(doctorService.deletePatient).mockRejectedValue(new Error("fail"));

      await useDoctorStore.getState().deletePatient(1);

      expect(useDoctorStore.getState().patients).toEqual([mockPatient]);
      expect(useDoctorStore.getState().recentCreated).toEqual([mockPatient]);
    });
  });

  describe("fetchPatientHistory — error path", () => {
    it("clears state on error", async () => {
      useDoctorStore.setState({
        selectedPatient: mockPatient,
        currentHistory: [{ animal_name: "งู", progress_percent: 75 }],
      });
      vi.mocked(doctorService.getPatientHistory).mockRejectedValue(new Error("fail"));

      await useDoctorStore.getState().fetchPatientHistory(1);

      expect(useDoctorStore.getState().selectedPatient).toBeNull();
      expect(useDoctorStore.getState().currentHistory).toEqual([]);
      expect(useDoctorStore.getState().isLoading).toBe(false);
    });
  });

  describe("fetchPatientTestHistory — error path", () => {
    it("clears state on error", async () => {
      useDoctorStore.setState({
        selectedPatient: mockPatient,
        currentTestHistory: [
          { id: 1, animal_name: "งู", stage_no: 1, symptom_note: "กลัวมาก" },
        ],
      });
      vi.mocked(doctorService.getPatientTestHistory).mockRejectedValue(new Error("fail"));

      await useDoctorStore.getState().fetchPatientTestHistory(1);

      expect(useDoctorStore.getState().selectedPatient).toBeNull();
      expect(useDoctorStore.getState().currentTestHistory).toEqual([]);
      expect(useDoctorStore.getState().isLoading).toBe(false);
    });
  });
});
