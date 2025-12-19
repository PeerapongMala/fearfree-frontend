// src/stores/user.store.ts
import { create } from "zustand";
import {
  UserProfile,
  RedemptionHistoryItem,
  MyPlayHistoryItem,
} from "@/models/user.model";
import { userService } from "@/services/user.service";
import { useAuthStore } from "@/stores/auth.store";

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
      console.log("Using Mock Data for Profile");
      const currentUser = useAuthStore.getState().user;
      const isDoctor = currentUser?.role === "doctor";
      set({
        profile: isDoctor
          ? {
              id: 1,
              role: "doctor",
              full_name: "ดร. พีระพงษ์ มาลา",
              email: "doc@hospital.com",
              hospital_name: "รพ.มหาราชนครเชียงใหม่",
            }
          : {
              id: 2,
              role: "patient",
              full_name: "พีระพงษ์ มาลา",
              email: "johndoe@gmail.com",
              age: 19,
              coins: 30,
              hospital_name: "รพ.มหาราชนครเชียงใหม่",
              most_fear_animal: "งู",
              fear_percentage: 60,
              fear_level_text: "ปานกลาง",
            },
        isLoading: false,
      });
    }
  },

  // ✅ Implementation: ประวัติการแลกรางวัล
  fetchRedemptionHistory: async () => {
    set({ isLoading: true });
    try {
      const res = await userService.getRedemptionHistory();
      set({ redemptionHistory: res.data, isLoading: false });
    } catch (error) {
      console.log("Using Mock Data for Redemption History");
      set({
        redemptionHistory: [
          {
            id: 1,
            date: "14 Aug 2025",
            reward_name: "ส่วนลดค่ารักษา 10%",
            coins_used: 30,
            status: "success",
          },
          {
            id: 2,
            date: "14 Aug 2025",
            reward_name: "ตุ๊กตาพี่หมอ",
            coins_used: 50,
            status: "success",
          },
          {
            id: 3,
            date: "10 Aug 2025",
            reward_name: "คูปอง Starbucks",
            coins_used: 30,
            status: "success",
          },
        ],
        isLoading: false,
      });
    }
  },

  // ✅ Implementation: ประวัติการเล่น
  fetchMyPlayHistory: async () => {
    set({ isLoading: true });
    try {
      const res = await userService.getMyPlayHistory();
      set({ myPlayHistory: res.data, isLoading: false });
    } catch (error) {
      console.log("Using Mock Data for Play History");
      set({
        myPlayHistory: [
          { animal_name: "งู", progress_percent: 100 },
          { animal_name: "แมว", progress_percent: 80 },
          { animal_name: "มด", progress_percent: 40 },
          { animal_name: "แมงมุม", progress_percent: 10 },
        ],
        isLoading: false,
      });
    }
  },
}));
