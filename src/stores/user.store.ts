// src/stores/user.store.ts
import { create } from "zustand";
import {
  UserProfile,
  RedemptionHistoryItem,
  MyPlayHistoryItem,
} from "@/models/user.model";
import { userService } from "@/services/user.service";
import toast from "react-hot-toast";

interface UserState {
  profile: UserProfile | null;
  isLoading: boolean;

  // ✅ State ใหม่
  redemptionHistory: RedemptionHistoryItem[];
  myPlayHistory: MyPlayHistoryItem[];

  // Actions
  fetchProfile: () => Promise<void>;
  fetchRedemptionHistory: () => Promise<void>;
  fetchMyPlayHistory: () => Promise<void>;
}

export const useUserStore = create<UserState>((set) => ({
  profile: null,
  isLoading: false,
  redemptionHistory: [],
  myPlayHistory: [],

  fetchProfile: async () => {
    set({ isLoading: true });
    try {
      const res = await userService.getProfile();
      set({ profile: res.data, isLoading: false });
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("ไม่สามารถโหลดโปรไฟล์ได้");
      set({ profile: null, isLoading: false });
    }
  },

  fetchRedemptionHistory: async () => {
    set({ isLoading: true });
    try {
      const res = await userService.getRedemptionHistory();
      set({ redemptionHistory: res.data || [], isLoading: false });
    } catch (error) {
      console.error("Error fetching redemption history:", error);
      toast.error("ไม่สามารถโหลดประวัติการแลกรางวัลได้");
      set({ redemptionHistory: [], isLoading: false });
    }
  },

  fetchMyPlayHistory: async () => {
    set({ isLoading: true });
    try {
      const res = await userService.getMyPlayHistory();
      set({ myPlayHistory: res.data || [], isLoading: false });
    } catch (error) {
      console.error("Error fetching play history:", error);
      toast.error("ไม่สามารถโหลดประวัติการเล่นได้");
      set({ myPlayHistory: [], isLoading: false });
    }
  },
}));
