import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { UserProfile } from "@/models/user.model";

interface AuthState {
  user: UserProfile | null;
  token: string | null;
  refreshToken: string | null;
  login: (user: UserProfile, token: string, refreshToken?: string) => void;
  setTokens: (token: string, refreshToken: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      refreshToken: null,
      login: (user, token, refreshToken) =>
        set({ user, token, refreshToken: refreshToken ?? null }),
      setTokens: (token, refreshToken) => set({ token, refreshToken }),
      logout: () => set({ user: null, token: null, refreshToken: null }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({ user: state.user }), // never persist tokens in browser storage
    }
  )
);
