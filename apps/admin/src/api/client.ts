import { createApiClient, DEFAULT_ERROR_MESSAGES } from '@repo/api-client';
import { getAuthToken } from '../stores/auth';
import { toast } from '@repo/ui';

// This will be set by the app initialization in main.tsx
let onUnauthorizedCallback: (() => void) | undefined;

export const setUnauthorizedHandler = (handler: () => void) => {
  onUnauthorizedCallback = handler;
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
  onBeforeRequest: async () => {
    // Auto-refresh logic removed in favor of manual revalidation dialog
  },
  onError: async (response) => {
    const data = await response.json().catch(() => ({}));
    const message = data.message || DEFAULT_ERROR_MESSAGES[response.status] || response.statusText;
    toast.error(`Error ${response.status}: ${message}`);
  },
});
