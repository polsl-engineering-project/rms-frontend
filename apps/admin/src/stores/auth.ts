import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Token TTL: 60 minutes (in milliseconds)
const TOKEN_TTL_MS = 60 * 60 * 1000;

// Warning threshold: triggers when 15 minutes remain until expiration (in milliseconds)
const TOKEN_EXPIRY_WARNING_MS = 15 * 60 * 1000;

interface AuthState {
  token: string | null;
  tokenExpiresAt: number | null; // Unix timestamp in milliseconds
  isRefreshing: boolean;
  setToken: (token: string) => void;
  clearAuth: () => void;
  isAuthenticated: () => boolean;
  isTokenExpired: () => boolean;
  isTokenExpiringSoon: () => boolean;
  getTimeUntilExpiry: () => number | null;
  getTimeUntilWarning: () => number | null;
  setIsRefreshing: (isRefreshing: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      tokenExpiresAt: null,
      isRefreshing: false,

      setToken: (token: string) => {
        const expiresAt = Date.now() + TOKEN_TTL_MS;
        set({ token, tokenExpiresAt: expiresAt });
      },

      clearAuth: () => {
        set({ token: null, tokenExpiresAt: null, isRefreshing: false });
      },

      isAuthenticated: () => {
        const { token, tokenExpiresAt } = get();
        if (!token || token.length === 0) return false;
        if (!tokenExpiresAt) return false;
        return Date.now() < tokenExpiresAt;
      },

      isTokenExpired: () => {
        const { tokenExpiresAt } = get();
        if (!tokenExpiresAt) return true;
        return Date.now() >= tokenExpiresAt;
      },

      isTokenExpiringSoon: () => {
        const { tokenExpiresAt } = get();
        if (!tokenExpiresAt) return false;
        const timeUntilExpiry = tokenExpiresAt - Date.now();
        return timeUntilExpiry <= TOKEN_EXPIRY_WARNING_MS && timeUntilExpiry > 0;
      },

      getTimeUntilExpiry: () => {
        const { tokenExpiresAt } = get();
        if (!tokenExpiresAt) return null;
        const timeRemaining = tokenExpiresAt - Date.now();
        return timeRemaining > 0 ? timeRemaining : 0;
      },

      getTimeUntilWarning: () => {
        const { tokenExpiresAt } = get();
        if (!tokenExpiresAt) return null;
        const warningTime = tokenExpiresAt - TOKEN_EXPIRY_WARNING_MS;
        const timeUntilWarning = warningTime - Date.now();
        return timeUntilWarning > 0 ? timeUntilWarning : 0;
      },

      setIsRefreshing: (isRefreshing: boolean) => {
        set({ isRefreshing });
      },
    }),
    {
      name: 'auth-storage', // localStorage key
      storage: createJSONStorage(() => localStorage),
      // Only persist non-sensitive metadata (not the token itself)
      // Token is kept in memory only to prevent XSS attacks
      partialize: (state) => ({
        tokenExpiresAt: state.tokenExpiresAt,
        isRefreshing: state.isRefreshing,
      }),
    }
  )
);

export const getAuthToken = (): string | undefined => {
  const token = useAuthStore.getState().token;
  return token || undefined;
};
