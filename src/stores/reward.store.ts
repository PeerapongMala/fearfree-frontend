// src/stores/reward.store.ts
import { create } from "zustand";
import { Reward } from "@/models/reward.model";
import { rewardService } from "@/services/reward.service";
import { useUserStore } from "@/stores/user.store"; // เพื่อไปอัปเดตเหรียญใน User Store
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
      console.warn("Using Mock Data for Rewards", error);
      toast.error("ไม่สามารถโหลดรางวัลได้ กำลังใช้ข้อมูลตัวอย่าง");
      set({
        rewards: [
          {
            id: 1,
            name: "รับส่วนลด 10 บาท",
            cost_coins: 30,
            image_url: "https://placehold.co/100x100?text=IceCream",
          },
          {
            id: 2,
            name: "รับส่วนลด 15 บาท",
            cost_coins: 30,
            image_url: "https://placehold.co/100x100?text=BobaTea",
          },
          {
            id: 3,
            name: "รับส่วนลดค่าตั๋วเข้าชม 100 บาท",
            cost_coins: 300,
            image_url: "https://placehold.co/100x100?text=Zoo",
          },
          {
            id: 4,
            name: "รับส่วนลดค่าตั๋วเข้าชม 100 บาท",
            cost_coins: 300,
            image_url: "https://placehold.co/100x100?text=Cave",
          },
        ],
        isLoading: false,
      });
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
      console.error("Redeem failed", error);
      toast.error("แลกรางวัลล้มเหลว กรุณาลองใหม่อีกครั้ง");
      return false;
    }
  },
}));
