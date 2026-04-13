// src/features/admin/admin.store.ts
import { create } from "zustand";
import axios from "axios";
import { AdminReward, AdminRewardInput, AdminCategoryInput, AdminAnimalInput, AdminStageInput, AdminCategoryWithHierarchy } from "./admin.model";
import { adminService } from "./admin.service";
import { gameService } from "@/features/game";
import toast from "react-hot-toast";
import { logger } from "@/shared/lib/logger";

function getErrorMessage(err: unknown, fallback: string): string {
  if (axios.isAxiosError(err)) {
    return err.response?.data?.error ?? fallback;
  }
  return fallback;
}

interface AdminState {
  rewards: AdminReward[];
  isFetching: boolean;
  isSubmitting: boolean;

  fetchRewards: () => Promise<void>;
  createReward: (data: AdminRewardInput) => Promise<boolean>;
  updateReward: (id: number, data: AdminRewardInput) => Promise<boolean>;
  deleteReward: (id: number) => Promise<boolean>;

  // Game Hierarchy State
  categories: AdminCategoryWithHierarchy[];
  fetchGamesHierarchy: () => Promise<void>;

  // Mutations
  createCategory: (data: AdminCategoryInput) => Promise<boolean>;
  deleteCategory: (id: number) => Promise<boolean>;
  createAnimal: (data: AdminAnimalInput) => Promise<boolean>;
  deleteAnimal: (id: number) => Promise<boolean>;
  createStage: (data: AdminStageInput) => Promise<boolean>;
  deleteStage: (id: number) => Promise<boolean>;
}

export const useAdminStore = create<AdminState>((set, get) => ({
  rewards: [],
  categories: [],
  isFetching: false,
  isSubmitting: false,

  fetchRewards: async () => {
    set({ isFetching: true });
    try {
      const res = await adminService.getRewards();
      set({ rewards: res.data || [], isFetching: false });
    } catch (err: unknown) {
      logger.error("Error fetching rewards", err);
      toast.error("ไม่สามารถดึงข้อมูลของรางวัลได้");
      set({ isFetching: false });
    }
  },

  createReward: async (data) => {
    set({ isSubmitting: true });
    try {
      const res = await adminService.createReward(data);
      if (res.success) {
        set((state) => ({ rewards: [...state.rewards, res.data] }));
        toast.success("เพิ่มของรางวัลสำเร็จ");
        return true;
      }
      return false;
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "เพิ่มของรางวัลไม่สำเร็จ"));
      return false;
    } finally {
      set({ isSubmitting: false });
    }
  },

  updateReward: async (id, data) => {
    set({ isSubmitting: true });
    try {
      const res = await adminService.updateReward(id, data);
      if (res.success) {
        set((state) => ({
          rewards: state.rewards.map((r) => (r.id === id ? res.data : r)),
        }));
        toast.success("อัปเดตของรางวัลสำเร็จ");
        return true;
      }
      return false;
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "อัปเดตไม่สำเร็จ"));
      return false;
    } finally {
      set({ isSubmitting: false });
    }
  },

  deleteReward: async (id) => {
    set({ isSubmitting: true });
    try {
      const res = await adminService.deleteReward(id);
      if (res.success) {
        set((state) => ({
          rewards: state.rewards.filter((r) => r.id !== id),
        }));
        toast.success("ลบของรางวัลสำเร็จ");
        return true;
      }
      return false;
    } catch (err: unknown) {
      toast.error("ลบของรางวัลไม่สำเร็จ");
      return false;
    } finally {
      set({ isSubmitting: false });
    }
  },

  // === GAMES HIERARCHY ===
  fetchGamesHierarchy: async () => {
    set({ isFetching: true });
    try {
      const res = await gameService.getCategories();
      const flatCategories = res.data || [];

      // getCategories returns categories WITHOUT animals preloaded.
      // Fetch animals for each category in parallel, then merge into hierarchy.
      const categoriesWithAnimals: AdminCategoryWithHierarchy[] = await Promise.all(
        flatCategories.map(async (cat) => {
          try {
            const animalsRes = await gameService.getAnimalsByCategory(cat.id);
            const animals = (animalsRes.data || []).map((a) => ({
              id: a.id,
              name: a.name,
              description: a.description,
              thumbnail_url: a.thumbnail_url,
            }));
            return { ...cat, animals };
          } catch {
            return { ...cat, animals: [] };
          }
        })
      );

      set({ categories: categoriesWithAnimals, isFetching: false });
    } catch (err: unknown) {
      logger.error("Error fetching games hierarchy", err);
      toast.error("ดึงข้อมูลโครงสร้างเกมไม่สำเร็จ");
      set({ isFetching: false });
    }
  },

  createCategory: async (data) => {
    try {
      const res = await adminService.createCategory(data);
      if (res.success) { await get().fetchGamesHierarchy(); toast.success("สร้างหมวดหมู่สำเร็จ"); return true; }
      return false;
    } catch { toast.error("สร้างหมวดหมู่ไม่สำเร็จ"); return false; }
  },
  deleteCategory: async (id) => {
    try {
      const res = await adminService.deleteCategory(id);
      if (res.success) { await get().fetchGamesHierarchy(); toast.success("ลบสำเร็จ"); return true; }
      return false;
    } catch { toast.error("ลบไม่สำเร็จ"); return false; }
  },

  createAnimal: async (data) => {
    try {
      const res = await adminService.createAnimal(data);
      if (res.success) { await get().fetchGamesHierarchy(); toast.success("สร้างสัตว์สำเร็จ"); return true; }
      return false;
    } catch { toast.error("สร้างสัตว์ไม่สำเร็จ"); return false; }
  },
  deleteAnimal: async (id) => {
    try {
      const res = await adminService.deleteAnimal(id);
      if (res.success) { await get().fetchGamesHierarchy(); toast.success("ลบสำเร็จ"); return true; }
      return false;
    } catch { toast.error("ลบไม่สำเร็จ"); return false; }
  },

  createStage: async (data) => {
    try {
      const res = await adminService.createStage(data);
      if (res.success) { await get().fetchGamesHierarchy(); toast.success("สร้างด่านสำเร็จ"); return true; }
      return false;
    } catch { toast.error("สร้างด่านไม่สำเร็จ"); return false; }
  },
  deleteStage: async (id) => {
    try {
      const res = await adminService.deleteStage(id);
      if (res.success) { await get().fetchGamesHierarchy(); toast.success("ลบสำเร็จ"); return true; }
      return false;
    } catch { toast.error("ลบไม่สำเร็จ"); return false; }
  },
}));
