// src/services/reward.service.ts
import axios from "axios";
import { Reward, RedeemResponse } from "@/models/reward.model";
import { useAuthStore } from "@/stores/auth.store";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

const getAuthHeaders = () => {
  const token = useAuthStore.getState().token;
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const rewardService = {
  // ✅ GET: /rewards/v1 (ดึงรายการของรางวัล)
  getRewards: async () => {
    const response = await axios.get<{ data: Reward[] }>(
      `${API_URL}/rewards/v1`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  },

  // ✅ POST: /rewards/v1/{rewardId}/redeem (แลกรางวัล)
  redeemReward: async (rewardId: number) => {
    const response = await axios.post<RedeemResponse>(
      `${API_URL}/rewards/v1/${rewardId}/redeem`,
      {},
      { headers: getAuthHeaders() }
    );
    return response.data;
  },
};
