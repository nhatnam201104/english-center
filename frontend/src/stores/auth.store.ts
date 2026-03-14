import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserResponse } from '../types/user/response';
import { logoutService } from '../services/auth.service';

interface AuthState {
  user: UserResponse | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: UserResponse, token: string) => void;
  logout: () => void;
  handleLogout: () => Promise<void>;
  updateUser: (user: Partial<UserResponse>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setAuth: (user, token) =>
        set({
          user,
          token,
          isAuthenticated: true,
        }),
      logout: () =>
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        }),
      handleLogout: async () => {
        try {
          // Gọi API logout
          await logoutService();
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          // Luôn xóa local state bất kể API success hay fail
          set({
            user: null,
            token: null,
            isAuthenticated: false,
          });
        }
      },
      updateUser: (updatedUser) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updatedUser } : null,
        })),
    }),
    {
      name: 'auth-storage', // Key for localStorage
    }
  )
);