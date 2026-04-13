import { describe, it, expect, beforeEach, vi } from "vitest";
import { useAssessmentStore } from "./assessment.store";

vi.mock("./assessment.service", () => ({
  assessmentService: {
    getQuestions: vi.fn(),
    submitAssessment: vi.fn(),
  },
}));

import { assessmentService } from "./assessment.service";

const mockQuestions = [
  { id: 1, prompt: "Question 1" },
  { id: 2, prompt: "Question 2" },
  { id: 3, prompt: "Question 3" },
];

describe("useAssessmentStore", () => {
  beforeEach(() => {
    useAssessmentStore.setState({
      questions: [],
      answers: {},
      result: null,
      isLoading: false,
      error: null,
    });
    vi.clearAllMocks();
  });

  describe("initial state", () => {
    it("starts with empty questions, answers, and null result", () => {
      const state = useAssessmentStore.getState();
      expect(state.questions).toEqual([]);
      expect(state.answers).toEqual({});
      expect(state.result).toBeNull();
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });
  });

  describe("fetchQuestions", () => {
    it("fetches questions and initializes answers to 5", async () => {
      vi.mocked(assessmentService.getQuestions).mockResolvedValue({
        data: mockQuestions,
      });

      await useAssessmentStore.getState().fetchQuestions();

      const state = useAssessmentStore.getState();
      expect(state.questions).toEqual(mockQuestions);
      expect(state.answers).toEqual({ 1: 5, 2: 5, 3: 5 });
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });

    it("sets error when fetch fails", async () => {
      vi.mocked(assessmentService.getQuestions).mockRejectedValue(
        new Error("Network error"),
      );

      await useAssessmentStore.getState().fetchQuestions();

      const state = useAssessmentStore.getState();
      expect(state.questions).toEqual([]);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeTruthy();
    });

    it("sets isLoading during fetch", async () => {
      let resolvePromise: (value: unknown) => void;
      vi.mocked(assessmentService.getQuestions).mockImplementation(
        () => new Promise((resolve) => { resolvePromise = resolve; }),
      );

      const fetchPromise = useAssessmentStore.getState().fetchQuestions();
      expect(useAssessmentStore.getState().isLoading).toBe(true);

      resolvePromise!({ data: [] });
      await fetchPromise;
      expect(useAssessmentStore.getState().isLoading).toBe(false);
    });
  });

  describe("setAnswer", () => {
    it("updates a single answer immutably", () => {
      useAssessmentStore.setState({ answers: { 1: 5, 2: 5 } });
      useAssessmentStore.getState().setAnswer(1, 8);

      const state = useAssessmentStore.getState();
      expect(state.answers[1]).toBe(8);
      expect(state.answers[2]).toBe(5);
    });
  });

  describe("submitAnswers", () => {
    it("submits answers and sets result on success", async () => {
      useAssessmentStore.setState({ answers: { 1: 7, 2: 3 } });
      vi.mocked(assessmentService.submitAssessment).mockResolvedValue({
        fear_level: "medium",
        percent: 50,
        description: "ปานกลาง",
      });

      const success = await useAssessmentStore.getState().submitAnswers();

      expect(success).toBe(true);
      expect(useAssessmentStore.getState().result).toEqual({
        fear_level: "medium",
        percent: 50,
        description: "ปานกลาง",
      });
    });

    it("returns false and sets error on failure", async () => {
      useAssessmentStore.setState({ answers: { 1: 5 } });
      vi.mocked(assessmentService.submitAssessment).mockRejectedValue(
        new Error("Server error"),
      );

      const success = await useAssessmentStore.getState().submitAnswers();

      expect(success).toBe(false);
      expect(useAssessmentStore.getState().error).toBeTruthy();
    });
  });
});
