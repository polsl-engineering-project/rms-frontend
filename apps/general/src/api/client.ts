import { createApiClient, DEFAULT_ERROR_MESSAGES } from '@repo/api-client';
import { toast } from '@repo/ui';

export const { $api, fetchClient } = createApiClient({
  baseUrl: import.meta.env.VITE_API_URL,
  getToken: () => undefined, // No auth for general app
  onError: async (response) => {
    const data = await response.json().catch(() => ({}));
    const message = data.message || DEFAULT_ERROR_MESSAGES[response.status] || response.statusText;
    toast.error(`Error ${response.status}: ${message}`);
  },
});
