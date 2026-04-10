// src/stores/game.store.ts
import { create } from "zustand";
import {
  GameCategory,
  Animal,
  StageStatus,
  GameRules,
  StageDetail,
  StageSubmissionResponse,
} from "@/models/game.model";
import { gameService } from "@/services/game.service";

interface GameState {
  // ... (State เดิม)
  categories: GameCategory[];
  currentAnimals: Animal[];
  selectedAnimal: Animal | null;
  stages: StageStatus[];
  currentStageDetail: StageDetail | null;
  gameRules: GameRules | null;
  isLoading: boolean;
  error: string | null;

  // ... (Action เดิม)
  fetchCategories: () => Promise<void>;
  fetchAnimalsByCategory: (categoryId: number) => Promise<void>;
  fetchAnimalAndStages: (animalId: number) => Promise<void>;
  fetchGameRules: () => Promise<void>;
  fetchStageDetail: (stageId: number) => Promise<void>;

  // ✅ [แก้ไข] เปลี่ยน Return Type เป็น Promise<StageSubmissionResponse | null>
  // เพื่อส่งข้อมูลเหรียญและด่านถัดไปคืนให้หน้าเว็บ
  submitStage: (
    stageId: number,
    isSuccess: boolean,
    note?: string
  ) => Promise<StageSubmissionResponse | null>;

  getStageIdByNo: (stageNo: number) => number | null;
}

export const useGameStore = create<GameState>((set, get) => ({
  // ... (Initial State เดิม) ...
  categories: [],
  currentAnimals: [],
  selectedAnimal: null,
  stages: [],
  currentStageDetail: null,
  gameRules: null,
  isLoading: false,
  error: null,

  // ... (Implementation เดิม) ...
  fetchCategories: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await gameService.getCategories();
      set({ categories: res.data || [], isLoading: false });
    } catch (err: unknown) {
      console.error("Error fetching categories:", err);
      set({ error: "ไม่สามารถโหลดหมวดหมู่ได้", isLoading: false });
    }
  },
  fetchAnimalsByCategory: async (categoryId) => {
    set({ isLoading: true, error: null });
    try {
      const res = await gameService.getAnimalsByCategory(categoryId);
      set({ currentAnimals: res.data || [], isLoading: false });
    } catch (err: unknown) {
      console.error("Error fetching animals:", err);
      set({ error: "ไม่สามารถโหลดรายการสัตว์ได้", isLoading: false });
    }
  },
  fetchAnimalAndStages: async (animalId) => {
    set({ isLoading: true, error: null, selectedAnimal: null, stages: [] });
    try {
      const stagesRes = await gameService.getStageProgress(animalId);
      const stagesData = stagesRes.data || [];

      // Try to find the animal from already-loaded currentAnimals
      const knownAnimal = get().currentAnimals.find((a) => a.id === animalId);

      set({
        selectedAnimal: knownAnimal ?? { id: animalId, name: "", category_id: 0 },
        stages: stagesData,
        isLoading: false,
      });
    } catch (err: unknown) {
      console.error("Error fetching animal and stages:", err);
      set({ error: "ไม่สามารถโหลดข้อมูลด่านได้", isLoading: false });
    }
  },
  fetchGameRules: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await gameService.getGameRules();
      set({ gameRules: res.data, isLoading: false });
    } catch (err: unknown) {
      console.error("Error fetching game rules:", err);
      set({ error: "ไม่สามารถโหลดกฎเกมได้", isLoading: false });
    }
  },
  fetchStageDetail: async (stageId) => {
    set({ isLoading: true, error: null, currentStageDetail: null });
    try {
      const res = await gameService.getStageDetail(stageId);
      set({ currentStageDetail: res.data, isLoading: false });
    } catch (err: unknown) {
      console.error("Error fetching stage detail:", err);
      set({ error: "ไม่สามารถโหลดรายละเอียดด่านได้", isLoading: false });
    }
  },

  // ✅ [แก้ไข implementation]
  submitStage: async (stageId: number, isSuccess: boolean, note?: string) => {
    try {
      const result = await gameService.submitStageResult(
        stageId,
        isSuccess,
        note
      );
      return result; // ส่ง data จริงกลับไป (มี earned_coins, next_stage)
    } catch (err: unknown) {
      console.error("Error submitting stage:", err);
      set({ error: "ไม่สามารถบันทึกผลด่านได้ กรุณาตรวจสอบการเชื่อมต่อ" });
      return null;
    }
  },

  getStageIdByNo: (stageNo: number) => {
    const stage = get().stages.find((s) => s.stage_no === stageNo);
    return stage ? stage.id : null;
  },
}));
