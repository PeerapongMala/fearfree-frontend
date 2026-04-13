// src/features/rewards/reward.service.ts
import apiClient from "@/shared/lib/api-client";
import { Reward, RedeemResponse } from "./reward.model";

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
