import { setUnauthorizedHandler, setRefreshTokenHandler, fetchClient } from '../api/client';
import { useAuthStore } from '../stores/auth';

export function setupAuthInterceptors() {
  // Handle 401 errors by clearing auth
  setUnauthorizedHandler(() => {
    const clearAuth = useAuthStore.getState().clearAuth;
    clearAuth();
    console.log('Session expired. Please log in again.');
  });

  // Handle automatic token refresh before requests
  setRefreshTokenHandler(async () => {
    const { setToken, setIsRefreshing, isRefreshing } = useAuthStore.getState();

    // Prevent concurrent refresh attempts
    if (isRefreshing) {
      return;
    }

    setIsRefreshing(true);

    try {
      const { data, error } = await fetchClient.POST('/api/v1/auth/refresh');

      if (error || !data?.accessToken) {
        throw new Error('Token refresh failed');
      }

      setToken(data.accessToken);
      console.log('[Auto-refresh] Token refreshed successfully');
    } catch (error) {
      console.error('[Auto-refresh] Failed:', error);
      throw error;
    } finally {
      setIsRefreshing(false);
    }
  });
}
