import { describe, it, expect, beforeEach, vi } from "vitest";
import { useRewardStore } from "./reward.store";

vi.mock("./reward.service", () => ({
  rewardService: {
    getRewards: vi.fn(),
    redeemReward: vi.fn(),
  },
}));

const mockFetchProfile = vi.fn();
vi.mock("@/features/user", () => ({
  useUserStore: {
    getState: () => ({
      fetchProfile: mockFetchProfile,
    }),
  },
}));

vi.mock("react-hot-toast", () => ({
  default: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

import { rewardService } from "./reward.service";

const mockRewards = [
  { id: 1, name: "Reward A", image_url: "https://example.com/a.png", cost_coins: 10 },
  { id: 2, name: "Reward B", image_url: "https://example.com/b.png", cost_coins: 20 },
];

describe("useRewardStore", () => {
  beforeEach(() => {
    useRewardStore.setState({ rewards: [], isLoading: false });
    vi.clearAllMocks();
  });

  describe("fetchRewards", () => {
    it("fetches and sets rewards", async () => {
      vi.mocked(rewardService.getRewards).mockResolvedValue({
        data: mockRewards,
      });

      await useRewardStore.getState().fetchRewards();

      const state = useRewardStore.getState();
      expect(state.rewards).toEqual(mockRewards);
      expect(state.isLoading).toBe(false);
    });

    it("sets empty array on failure", async () => {
      vi.mocked(rewardService.getRewards).mockRejectedValue(
        new Error("Network error"),
      );

      await useRewardStore.getState().fetchRewards();

      expect(useRewardStore.getState().rewards).toEqual([]);
      expect(useRewardStore.getState().isLoading).toBe(false);
    });
  });

  describe("redeemReward", () => {
    it("returns true on successful redemption and calls fetchProfile", async () => {
      vi.mocked(rewardService.redeemReward).mockResolvedValue({
        success: true,
        message: "OK",
        remaining_coins: 90,
      });

      const result = await useRewardStore.getState().redeemReward(1);

      expect(result).toBe(true);
      expect(rewardService.redeemReward).toHaveBeenCalledWith(1);
      expect(mockFetchProfile).toHaveBeenCalledTimes(1);
    });

    it("returns false when API says not successful", async () => {
      vi.mocked(rewardService.redeemReward).mockResolvedValue({
        success: false,
        message: "Not enough coins",
        remaining_coins: 0,
      });

      const result = await useRewardStore.getState().redeemReward(1);

      expect(result).toBe(false);
    });

    it("returns false on error", async () => {
      vi.mocked(rewardService.redeemReward).mockRejectedValue(
        new Error("Server error"),
      );

      const result = await useRewardStore.getState().redeemReward(1);

      expect(result).toBe(false);
    });
  });
});
