// src/services/reward.service.ts
import apiClient from "@/services/apiClient";
import { Reward, RedeemResponse } from "@/models/reward.model";

export const rewardService = {
  getRewards: async () => {
    const response = await apiClient.get<{ data: Reward[] }>("/rewards");
    return response.data;
  },

  redeemReward: async (rewardId: number) => {
    const response = await apiClient.post<RedeemResponse>(`/rewards/${rewardId}/redeem`, {});
    return response.data;
  },
};
