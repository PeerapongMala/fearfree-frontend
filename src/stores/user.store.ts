// src/stores/user.store.ts
import { create } from "zustand";
import { UserProfile } from "@/models/user.model";
import { userService } from "@/services/user.service";
import { useAuthStore } from "@/stores/auth.store";

interface UserState {
  profile: UserProfile | null;
  isLoading: boolean;
  fetchProfile: () => Promise<void>;
}

export const useUserStore = create<UserState>((set) => ({
  profile: null,
  isLoading: false,

  fetchProfile: async () => {
    set({ isLoading: true });
    try {
      const res = await userService.getProfile();
      set({ profile: res.data, isLoading: false });
    } catch (error) {
      console.log(
        "Fetching profile failed, using mock data based on Auth Store role"
      );

      // --- Mock Data Fallback ---
      const currentUser = useAuthStore.getState().user;
      const isDoctor = currentUser?.role === "doctor";

      const mockProfile: UserProfile = isDoctor
        ? {
            id: 1,
            role: "doctor",
            full_name: "ดร. พีระพงษ์ มาลา",
            email: "doctor@hospital.com",
            hospital_name: "โรงพยาบาลมหาราชนครเชียงใหม่",
            // หมอไม่มีค่าความกลัว
          }
        : {
            id: 2,
            role: "patient",
            full_name: "พีระพงษ์ มาลา",
            email: "johndoe@gmail.com",
            age: 19,
            hospital_name: "โรงพยาบาลมหาราชนครเชียงใหม่",
            most_fear_animal: "แมว",
            coins: 0,
            fear_percentage: 60,
            fear_level_text: "ระดับปานกลาง",
          };

      set({ profile: mockProfile, isLoading: false });
    }
  },
}));
