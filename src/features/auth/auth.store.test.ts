import { describe, it, expect, beforeEach } from "vitest";
import { useAuthStore } from "./auth.store";
import type { UserProfile } from "@/shared/types";

const mockUser: UserProfile = {
  id: 1,
  role: "doctor",
  full_name: "Dr. Test",
  email: "test@example.com",
};

describe("useAuthStore", () => {
  beforeEach(() => {
    useAuthStore.getState().logout();
  });

  describe("initial state", () => {
    it("starts with null user, token, and refreshToken", () => {
      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
      expect(state.refreshToken).toBeNull();
    });
  });

  describe("login", () => {
    it("sets user and token", () => {
      useAuthStore.getState().login(mockUser, "access-token");

      const state = useAuthStore.getState();
      expect(state.user).toEqual(mockUser);
      expect(state.token).toBe("access-token");
      expect(state.refreshToken).toBeNull();
    });

    it("sets refreshToken when provided", () => {
      useAuthStore.getState().login(mockUser, "access-token", "refresh-token");

      const state = useAuthStore.getState();
      expect(state.refreshToken).toBe("refresh-token");
    });
  });

  describe("setTokens", () => {
    it("updates token and refreshToken without changing user", () => {
      useAuthStore.getState().login(mockUser, "old-token", "old-refresh");
      useAuthStore.getState().setTokens("new-token", "new-refresh");

      const state = useAuthStore.getState();
      expect(state.user).toEqual(mockUser);
      expect(state.token).toBe("new-token");
      expect(state.refreshToken).toBe("new-refresh");
    });
  });

  describe("logout", () => {
    it("clears user, token, and refreshToken", () => {
      useAuthStore.getState().login(mockUser, "token", "refresh");
      useAuthStore.getState().logout();

      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
      expect(state.refreshToken).toBeNull();
    });
  });
});
