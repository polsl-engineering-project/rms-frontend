import { createApiClient } from '@repo/api-client';
import { getAuthToken, useAuthStore } from '../stores/auth';

// This will be set by the app initialization in main.tsx
let onUnauthorizedCallback: (() => void) | undefined;
let refreshTokenCallback: (() => Promise<void>) | undefined;

export const setUnauthorizedHandler = (handler: () => void) => {
  onUnauthorizedCallback = handler;
};

export const setRefreshTokenHandler = (handler: () => Promise<void>) => {
  refreshTokenCallback = handler;
};

export const { $api, fetchClient } = createApiClient({
  baseUrl: import.meta.env.VITE_API_URL,
  getToken: getAuthToken, // Grab token from auth store
  onUnauthorized: () => {
    // Trigger the unauthorized handler (e.g., logout or refresh)
    if (onUnauthorizedCallback) {
      onUnauthorizedCallback();
    }
  },
  onBeforeRequest: async (url: string) => {
    // Refresh token before each non-auth request
    const { isAuthenticated, isTokenExpiringSoon, isRefreshing } = useAuthStore.getState();

    // Only refresh if:
    // 1. User is authenticated
    // 2. Token is expiring soon
    // 3. Not already refreshing
    if (isAuthenticated() && isTokenExpiringSoon() && !isRefreshing && refreshTokenCallback) {
      console.log(`[Auto-refresh] Token expiring soon, refreshing before ${url}`);
      await refreshTokenCallback();
    }
  },
});
