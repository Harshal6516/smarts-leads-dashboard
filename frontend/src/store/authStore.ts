import { create } from "zustand";

import api from "../api/axios";

import { User } from "../types/auth.types";

interface AuthState {
  user: User | null;

  token: string | null;

  setAuth: (
    user: User,
    token: string
  ) => void;

  logout: () => void;

  fetchCurrentUser: () => Promise<void>;
}

export const useAuthStore =
  create<AuthState>((set) => ({
    user: null,

    token:
      localStorage.getItem(
        "token"
      ),

    setAuth: (
      user,
      token
    ) => {
      localStorage.setItem(
        "token",
        token
      );

      set({
        user,
        token,
      });
    },

    logout: () => {
      localStorage.removeItem(
        "token"
      );

      set({
        user: null,
        token: null,
      });
    },

    fetchCurrentUser:
      async () => {
        try {
          const response =
            await api.get(
              "/auth/me"
            );

          set({
            user:
              response.data
                .user,
          });
        } catch {
          localStorage.removeItem(
            "token"
          );

          set({
            user: null,
            token: null,
          });
        }
      },
  }));