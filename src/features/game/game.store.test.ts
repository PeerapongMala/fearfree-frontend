import { describe, it, expect, beforeEach, vi } from "vitest";
import { useGameStore } from "./game.store";

vi.mock("./game.service", () => ({
  gameService: {
    getCategories: vi.fn(),
    getAnimalsByCategory: vi.fn(),
    getStageProgress: vi.fn(),
    getGameRules: vi.fn(),
    submitStageResult: vi.fn(),
  },
}));

import { gameService } from "./game.service";

describe("useGameStore", () => {
  beforeEach(() => {
    useGameStore.setState({
      categories: [],
      currentAnimals: [],
      selectedAnimal: null,
      stages: [],
      gameRules: null,
      isLoading: false,
      error: null,
    });
    vi.clearAllMocks();
  });

  describe("fetchCategories", () => {
    it("fetches and sets categories", async () => {
      const cats = [{ id: 1, name: "Exposure" }];
      vi.mocked(gameService.getCategories).mockResolvedValue({ data: cats });

      await useGameStore.getState().fetchCategories();

      expect(useGameStore.getState().categories).toEqual(cats);
      expect(useGameStore.getState().isLoading).toBe(false);
    });

    it("sets error on failure", async () => {
      vi.mocked(gameService.getCategories).mockRejectedValue(new Error("fail"));

      await useGameStore.getState().fetchCategories();

      expect(useGameStore.getState().error).toBeTruthy();
      expect(useGameStore.getState().isLoading).toBe(false);
    });
  });

  describe("fetchAnimalsByCategory", () => {
    it("fetches and sets animals", async () => {
      const animals = [{ id: 1, name: "งู", category_id: 1 }];
      vi.mocked(gameService.getAnimalsByCategory).mockResolvedValue({ data: animals });

      await useGameStore.getState().fetchAnimalsByCategory(1);

      expect(useGameStore.getState().currentAnimals).toEqual(animals);
    });
  });

  describe("fetchAnimalAndStages", () => {
    it("fetches stages and sets selectedAnimal from cache", async () => {
      useGameStore.setState({
        currentAnimals: [{ id: 5, name: "งู", category_id: 1 }],
      });
      vi.mocked(gameService.getStageProgress).mockResolvedValue({
        data: [{ id: 1, stage_no: 1, is_locked: false, is_completed: false }],
      });

      await useGameStore.getState().fetchAnimalAndStages(5);

      expect(useGameStore.getState().selectedAnimal?.name).toBe("งู");
      expect(useGameStore.getState().stages).toHaveLength(1);
    });

    it("creates placeholder animal when not in cache", async () => {
      vi.mocked(gameService.getStageProgress).mockResolvedValue({ data: [] });

      await useGameStore.getState().fetchAnimalAndStages(99);

      expect(useGameStore.getState().selectedAnimal?.id).toBe(99);
      expect(useGameStore.getState().selectedAnimal?.name).toBe("");
    });
  });

  describe("fetchGameRules", () => {
    it("fetches and sets game rules", async () => {
      const rules = { stage_duration_seconds: 30, coin_per_stage: 10 };
      vi.mocked(gameService.getGameRules).mockResolvedValue({ data: rules });

      await useGameStore.getState().fetchGameRules();

      expect(useGameStore.getState().gameRules).toEqual(rules);
    });
  });

  describe("submitStage", () => {
    it("returns result on success", async () => {
      const result = { success: true, earned_coins: 10, next_stage: { has_next: true, stage_no: 2, stage_id: 2 } };
      vi.mocked(gameService.submitStageResult).mockResolvedValue(result);

      const res = await useGameStore.getState().submitStage(1, true, "note");

      expect(res).toEqual(result);
      expect(gameService.submitStageResult).toHaveBeenCalledWith(1, true, "note");
    });

    it("returns null and sets error on failure", async () => {
      vi.mocked(gameService.submitStageResult).mockRejectedValue(new Error("fail"));

      const res = await useGameStore.getState().submitStage(1, true);

      expect(res).toBeNull();
      expect(useGameStore.getState().error).toBeTruthy();
    });
  });

  describe("getStageIdByNo", () => {
    it("returns stage id for matching stage_no", () => {
      useGameStore.setState({
        stages: [
          { id: 10, stage_no: 1, is_locked: false, is_completed: false },
          { id: 20, stage_no: 2, is_locked: true, is_completed: false },
        ],
      });

      expect(useGameStore.getState().getStageIdByNo(2)).toBe(20);
    });

    it("returns null when stage not found", () => {
      useGameStore.setState({ stages: [] });

      expect(useGameStore.getState().getStageIdByNo(99)).toBeNull();
    });
  });

  describe("fetchAnimalsByCategory — error path", () => {
    it("sets error string on failure", async () => {
      vi.mocked(gameService.getAnimalsByCategory).mockRejectedValue(new Error("fail"));

      await useGameStore.getState().fetchAnimalsByCategory(1);

      expect(useGameStore.getState().error).toBeTruthy();
      expect(useGameStore.getState().isLoading).toBe(false);
    });
  });

  describe("fetchAnimalAndStages — error path", () => {
    it("sets error string on failure", async () => {
      vi.mocked(gameService.getStageProgress).mockRejectedValue(new Error("fail"));

      await useGameStore.getState().fetchAnimalAndStages(1);

      expect(useGameStore.getState().error).toBeTruthy();
      expect(useGameStore.getState().isLoading).toBe(false);
    });
  });
});
