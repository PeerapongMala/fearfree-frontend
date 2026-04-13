// src/features/rewards/reward.store.ts
import { create } from "zustand";
import { Reward } from "./reward.model";
import { rewardService } from "./reward.service";
import { logger } from "@/shared/lib/logger";
import { useUserStore } from "@/features/user"; // เพื่อไปอัปเดตเหรียญใน User Store
import toast from "react-hot-toast";

interface RewardState {
  rewards: Reward[];
  isLoading: boolean;

  fetchRewards: () => Promise<void>;
  redeemReward: (rewardId: number) => Promise<boolean>;
}

export const useRewardStore = create<RewardState>((set, get) => ({
  rewards: [],
  isLoading: false,

  fetchRewards: async () => {
    set({ isLoading: true });
    try {
      const res = await rewardService.getRewards();
      set({ rewards: res.data || [], isLoading: false });
    } catch (error) {
      logger.error("Error fetching rewards", error);
      toast.error("ไม่สามารถโหลดรางวัลได้");
      set({ rewards: [], isLoading: false });
    }
  },

  redeemReward: async (rewardId: number) => {
    try {
      const res = await rewardService.redeemReward(rewardId);
      if (res.success) {
        // ✅ ถ้าแลกสำเร็จ ให้ไปอัปเดตเหรียญใน User Store ทันที
        useUserStore.getState().fetchProfile();
        return true;
      }
      return false;
    } catch (error) {
      logger.error("Redeem failed", error);
      toast.error("แลกรางวัลล้มเหลว กรุณาลองใหม่อีกครั้ง");
      return false;
    }
  },
}));
