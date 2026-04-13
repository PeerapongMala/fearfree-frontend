import { describe, it, expect, vi, beforeEach } from "vitest";
import { authService } from "./auth.service";

const mockPost = vi.fn();

vi.mock("@/shared/lib/api-client", () => ({
  default: {
    post: (...args: unknown[]) => mockPost(...args),
  },
}));

describe("authService", () => {
  beforeEach(() => {
    mockPost.mockReset();
  });

  describe("login", () => {
    it("calls POST /auth/login with credentials and returns data", async () => {
      const mockResponse = {
        data: {
          message: "success",
          token: "access-token",
          refresh_token: "refresh-token",
          user: { id: 1, username: "doc1" },
        },
      };
      mockPost.mockResolvedValueOnce(mockResponse);

      const result = await authService.login({
        username: "doc1",
        password: "pass123",
      });

      expect(mockPost).toHaveBeenCalledWith("/auth/login", {
        username: "doc1",
        password: "pass123",
      });
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe("register", () => {
    it("calls POST /auth/signup with data and returns user_id", async () => {
      const mockResponse = {
        data: {
          message: "User created",
          user_id: 42,
        },
      };
      mockPost.mockResolvedValueOnce(mockResponse);

      const result = await authService.register({
        username: "newuser",
        password: "secret",
        email: "new@example.com",
      });

      expect(mockPost).toHaveBeenCalledWith("/auth/signup", {
        username: "newuser",
        password: "secret",
        email: "new@example.com",
      });
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe("patientLogin", () => {
    it("sends code as both username and password", async () => {
      const mockResponse = {
        data: {
          message: "success",
          token: "patient-token",
          refresh_token: "patient-refresh",
          user: { id: 2, username: "ABC123" },
        },
      };
      mockPost.mockResolvedValueOnce(mockResponse);

      const result = await authService.patientLogin("ABC123");

      expect(mockPost).toHaveBeenCalledWith("/auth/login", {
        username: "ABC123",
        password: "ABC123",
      });
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe("refreshToken", () => {
    it("calls POST /auth/refresh with refresh token", async () => {
      const mockResponse = {
        data: {
          token: "new-access-token",
          refresh_token: "new-refresh-token",
        },
      };
      mockPost.mockResolvedValueOnce(mockResponse);

      const result = await authService.refreshToken("old-refresh-token");

      expect(mockPost).toHaveBeenCalledWith("/auth/refresh", {
        refresh_token: "old-refresh-token",
      });
      expect(result).toEqual(mockResponse.data);
    });
  });
});
