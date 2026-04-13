import { describe, it, expect, beforeEach, vi } from "vitest";
import { useAdminStore } from "./admin.store";

vi.mock("./admin.service", () => ({
  adminService: {
    getRewards: vi.fn(),
    createReward: vi.fn(),
    updateReward: vi.fn(),
    deleteReward: vi.fn(),
    createCategory: vi.fn(),
    deleteCategory: vi.fn(),
    createAnimal: vi.fn(),
    deleteAnimal: vi.fn(),
    createStage: vi.fn(),
    deleteStage: vi.fn(),
  },
}));

vi.mock("@/features/game", () => ({
  gameService: {
    getCategories: vi.fn(),
    getAnimalsByCategory: vi.fn(),
  },
}));

vi.mock("react-hot-toast", () => ({
  default: { error: vi.fn(), success: vi.fn() },
}));

import { adminService } from "./admin.service";
import { gameService } from "@/features/game";

const mockReward = {
  id: 1,
  name: "ตุ๊กตา",
  description: "ตุ๊กตาหมี",
  cost_coins: 10,
  stock: 5,
  image_url: "https://example.com/img.png",
};

describe("useAdminStore", () => {
  beforeEach(() => {
    useAdminStore.setState({
      rewards: [],
      categories: [],
      isFetching: false,
      isSubmitting: false,
    });
    vi.clearAllMocks();
  });

  describe("fetchRewards", () => {
    it("fetches and sets rewards", async () => {
      vi.mocked(adminService.getRewards).mockResolvedValue({ data: [mockReward] });

      await useAdminStore.getState().fetchRewards();

      expect(useAdminStore.getState().rewards).toEqual([mockReward]);
      expect(useAdminStore.getState().isFetching).toBe(false);
    });

    it("uses isFetching flag (not isSubmitting)", async () => {
      let resolve: () => void;
      vi.mocked(adminService.getRewards).mockImplementation(
        () => new Promise((r) => { resolve = () => r({ data: [] }); }),
      );

      const promise = useAdminStore.getState().fetchRewards();
      expect(useAdminStore.getState().isFetching).toBe(true);
      expect(useAdminStore.getState().isSubmitting).toBe(false);

      resolve!();
      await promise;
    });
  });

  describe("createReward", () => {
    it("adds reward on success and uses isSubmitting", async () => {
      vi.mocked(adminService.createReward).mockResolvedValue({
        success: true,
        data: mockReward,
      });

      const result = await useAdminStore.getState().createReward({
        name: "ตุ๊กตา",
        description: "ตุ๊กตาหมี",
        cost_coins: 10,
        stock: 5,
        image_url: "",
      });

      expect(result).toBe(true);
      expect(useAdminStore.getState().rewards).toContainEqual(mockReward);
      expect(useAdminStore.getState().isSubmitting).toBe(false);
    });

    it("returns false on error", async () => {
      vi.mocked(adminService.createReward).mockRejectedValue(new Error("fail"));

      const result = await useAdminStore.getState().createReward({
        name: "x",
        description: "",
        cost_coins: 0,
        stock: 0,
        image_url: "",
      });

      expect(result).toBe(false);
      expect(useAdminStore.getState().isSubmitting).toBe(false);
    });
  });

  describe("updateReward", () => {
    it("updates reward in list on success", async () => {
      useAdminStore.setState({ rewards: [mockReward] });
      const updated = { ...mockReward, name: "Updated" };
      vi.mocked(adminService.updateReward).mockResolvedValue({
        success: true,
        data: updated,
      });

      const result = await useAdminStore.getState().updateReward(1, {
        name: "Updated",
        description: "ตุ๊กตาหมี",
        cost_coins: 10,
        stock: 5,
        image_url: "",
      });

      expect(result).toBe(true);
      expect(useAdminStore.getState().rewards[0].name).toBe("Updated");
    });
  });

  describe("deleteReward", () => {
    it("removes reward from list on success", async () => {
      useAdminStore.setState({ rewards: [mockReward] });
      vi.mocked(adminService.deleteReward).mockResolvedValue({ success: true });

      const result = await useAdminStore.getState().deleteReward(1);

      expect(result).toBe(true);
      expect(useAdminStore.getState().rewards).toEqual([]);
    });
  });

  describe("fetchGamesHierarchy", () => {
    it("fetches categories with animals merged", async () => {
      vi.mocked(gameService.getCategories).mockResolvedValue({
        data: [{ id: 1, name: "Exposure" }],
      });
      vi.mocked(gameService.getAnimalsByCategory).mockResolvedValue({
        data: [{ id: 10, name: "งู", category_id: 1 }],
      });

      await useAdminStore.getState().fetchGamesHierarchy();

      const cats = useAdminStore.getState().categories;
      expect(cats).toHaveLength(1);
      expect(cats[0].name).toBe("Exposure");
      expect(cats[0].animals).toHaveLength(1);
    });
  });

  describe("createCategory", () => {
    it("returns true on success and refreshes hierarchy", async () => {
      vi.mocked(adminService.createCategory).mockResolvedValue({
        success: true,
        data: { id: 1, name: "New", description: "" },
      });
      vi.mocked(gameService.getCategories).mockResolvedValue({ data: [] });

      const result = await useAdminStore.getState().createCategory({
        name: "New",
        description: "",
      });

      expect(result).toBe(true);
      expect(gameService.getCategories).toHaveBeenCalled();
    });

    it("returns false on error", async () => {
      vi.mocked(adminService.createCategory).mockRejectedValue(new Error("fail"));

      const result = await useAdminStore.getState().createCategory({
        name: "x",
        description: "",
      });

      expect(result).toBe(false);
    });
  });

  describe("deleteCategory", () => {
    it("returns true and refreshes hierarchy", async () => {
      vi.mocked(adminService.deleteCategory).mockResolvedValue({ success: true });
      vi.mocked(gameService.getCategories).mockResolvedValue({ data: [] });

      const result = await useAdminStore.getState().deleteCategory(1);

      expect(result).toBe(true);
    });
  });

  describe("createAnimal", () => {
    it("returns true on success and triggers fetchGamesHierarchy", async () => {
      vi.mocked(adminService.createAnimal).mockResolvedValue({
        success: true,
        data: { id: 1, category_id: 1, name: "งู", description: "งูเห่า", thumbnail_url: "" },
      });
      vi.mocked(gameService.getCategories).mockResolvedValue({ data: [] });

      const result = await useAdminStore.getState().createAnimal({
        category_id: 1,
        name: "งู",
        description: "งูเห่า",
        thumbnail_url: "",
      });

      expect(result).toBe(true);
      expect(gameService.getCategories).toHaveBeenCalled();
    });

    it("returns false on error", async () => {
      vi.mocked(adminService.createAnimal).mockRejectedValue(new Error("fail"));

      const result = await useAdminStore.getState().createAnimal({
        category_id: 1,
        name: "งู",
        description: "",
        thumbnail_url: "",
      });

      expect(result).toBe(false);
    });
  });

  describe("deleteAnimal", () => {
    it("returns true on success", async () => {
      vi.mocked(adminService.deleteAnimal).mockResolvedValue({ success: true });
      vi.mocked(gameService.getCategories).mockResolvedValue({ data: [] });

      const result = await useAdminStore.getState().deleteAnimal(1);

      expect(result).toBe(true);
    });

    it("returns false when success is false", async () => {
      vi.mocked(adminService.deleteAnimal).mockResolvedValue({ success: false });

      const result = await useAdminStore.getState().deleteAnimal(1);

      expect(result).toBe(false);
    });
  });

  describe("createStage", () => {
    it("returns true on success", async () => {
      vi.mocked(adminService.createStage).mockResolvedValue({
        success: true,
        data: {
          id: 1,
          animal_id: 1,
          stage_no: 1,
          media_type: "image",
          media_url: "https://example.com/img.png",
          display_time_sec: 30,
          reward_coins: 10,
        },
      });
      vi.mocked(gameService.getCategories).mockResolvedValue({ data: [] });

      const result = await useAdminStore.getState().createStage({
        animal_id: 1,
        stage_no: 1,
        media_type: "image",
        media_url: "https://example.com/img.png",
        display_time_sec: 30,
        reward_coins: 10,
      });

      expect(result).toBe(true);
    });
  });

  describe("deleteStage", () => {
    it("returns true on success", async () => {
      vi.mocked(adminService.deleteStage).mockResolvedValue({ success: true });
      vi.mocked(gameService.getCategories).mockResolvedValue({ data: [] });

      const result = await useAdminStore.getState().deleteStage(1);

      expect(result).toBe(true);
    });
  });

  describe("updateReward — error path", () => {
    it("returns false on error", async () => {
      vi.mocked(adminService.updateReward).mockRejectedValue(new Error("fail"));

      const result = await useAdminStore.getState().updateReward(1, {
        name: "x",
        description: "",
        cost_coins: 0,
        stock: 0,
        image_url: "",
      });

      expect(result).toBe(false);
      expect(useAdminStore.getState().isSubmitting).toBe(false);
    });
  });

  describe("deleteReward — error path", () => {
    it("returns false on error", async () => {
      vi.mocked(adminService.deleteReward).mockRejectedValue(new Error("fail"));

      const result = await useAdminStore.getState().deleteReward(1);

      expect(result).toBe(false);
      expect(useAdminStore.getState().isSubmitting).toBe(false);
    });
  });

  describe("fetchGamesHierarchy — error path", () => {
    it("sets isFetching false on error", async () => {
      vi.mocked(gameService.getCategories).mockRejectedValue(new Error("fail"));

      await useAdminStore.getState().fetchGamesHierarchy();

      expect(useAdminStore.getState().isFetching).toBe(false);
    });
  });

  describe("fetchGamesHierarchy — partial failure", () => {
    it("returns category with empty animals when getAnimalsByCategory fails for one", async () => {
      vi.mocked(gameService.getCategories).mockResolvedValue({
        data: [
          { id: 1, name: "Exposure" },
          { id: 2, name: "Relaxation" },
        ],
      });
      vi.mocked(gameService.getAnimalsByCategory)
        .mockResolvedValueOnce({
          data: [{ id: 10, name: "งู", category_id: 1 }],
        })
        .mockRejectedValueOnce(new Error("fail for cat 2"));

      await useAdminStore.getState().fetchGamesHierarchy();

      const cats = useAdminStore.getState().categories;
      expect(cats).toHaveLength(2);
      expect(cats[0].animals).toHaveLength(1);
      expect(cats[1].animals).toHaveLength(0);
    });
  });
});
