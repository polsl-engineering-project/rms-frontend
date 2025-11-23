import { createApiClient, DEFAULT_ERROR_MESSAGES } from '@repo/api-client';
import { getAuthToken, useAuthStore } from '../stores/auth';
import { toast } from '@repo/ui';

// This will be set by the app initialization in main.tsx
let onUnauthorizedCallback: (() => void) | undefined;
let refreshTokenCallback: (() => Promise<void>) | undefined;

// Promise to track ongoing refresh operations and prevent race conditions
let refreshPromise: Promise<void> | null = null;

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
      // If there's already a refresh in progress, wait for it
      if (refreshPromise) {
        console.log(`[Auto-refresh] Refresh already in progress, waiting for ${url}`);
        await refreshPromise;
        return;
      }

      console.log(`[Auto-refresh] Token expiring soon, refreshing before ${url}`);
      
      // Start a new refresh and track it
      refreshPromise = refreshTokenCallback()
        .finally(() => {
          // Clear the promise once complete (success or failure)
          refreshPromise = null;
        });
      
      await refreshPromise;
    }
  },
  onError: async (response) => {
    const data = await response.json().catch(() => ({}));
    const message = data.message || DEFAULT_ERROR_MESSAGES[response.status] || response.statusText;
    toast.error(`Error ${response.status}: ${message}`);
  },
});
