import { createApiClient } from '@repo/api-client';

export const { $api, fetchClient } = createApiClient({
  baseUrl: import.meta.env.VITE_API_URL,
  getToken: () => undefined, // No auth for general app
});
