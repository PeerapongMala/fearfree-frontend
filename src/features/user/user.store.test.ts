import { describe, it, expect, beforeEach, vi } from "vitest";
import { useUserStore } from "./user.store";

vi.mock("./user.service", () => ({
  userService: {
    getProfile: vi.fn(),
    getRedemptionHistory: vi.fn(),
    getMyPlayHistory: vi.fn(),
  },
}));

vi.mock("react-hot-toast", () => ({
  default: { error: vi.fn(), success: vi.fn() },
}));

import { userService } from "./user.service";

const mockProfile = {
  id: 1,
  role: "patient" as const,
  full_name: "Test User",
  email: "test@example.com",
  coins: 100,
};

describe("useUserStore", () => {
  beforeEach(() => {
    useUserStore.setState({
      profile: null,
      isLoading: false,
      redemptionHistory: [],
      myPlayHistory: [],
    });
    vi.clearAllMocks();
  });

  describe("fetchProfile", () => {
    it("fetches and sets profile", async () => {
      vi.mocked(userService.getProfile).mockResolvedValue({ data: mockProfile });

      await useUserStore.getState().fetchProfile();

      expect(useUserStore.getState().profile).toEqual(mockProfile);
      expect(useUserStore.getState().isLoading).toBe(false);
    });

    it("sets null profile on failure", async () => {
      vi.mocked(userService.getProfile).mockRejectedValue(new Error("fail"));

      await useUserStore.getState().fetchProfile();

      expect(useUserStore.getState().profile).toBeNull();
    });
  });

  describe("fetchRedemptionHistory", () => {
    it("fetches and sets redemption history", async () => {
      const history = [
        { id: 1, date: "14 Aug 2025", reward_name: "ตุ๊กตา", coins_used: 10, status: "success" as const },
      ];
      vi.mocked(userService.getRedemptionHistory).mockResolvedValue({ data: history });

      await useUserStore.getState().fetchRedemptionHistory();

      expect(useUserStore.getState().redemptionHistory).toEqual(history);
    });

    it("sets empty array on failure", async () => {
      vi.mocked(userService.getRedemptionHistory).mockRejectedValue(new Error("fail"));

      await useUserStore.getState().fetchRedemptionHistory();

      expect(useUserStore.getState().redemptionHistory).toEqual([]);
    });
  });

  describe("fetchMyPlayHistory", () => {
    it("fetches and sets play history", async () => {
      const history = [{ animal_name: "งู", progress_percent: 80 }];
      vi.mocked(userService.getMyPlayHistory).mockResolvedValue({ data: history });

      await useUserStore.getState().fetchMyPlayHistory();

      expect(useUserStore.getState().myPlayHistory).toEqual(history);
    });

    it("sets empty array on failure", async () => {
      vi.mocked(userService.getMyPlayHistory).mockRejectedValue(new Error("fail"));

      await useUserStore.getState().fetchMyPlayHistory();

      expect(useUserStore.getState().myPlayHistory).toEqual([]);
    });
  });
});
