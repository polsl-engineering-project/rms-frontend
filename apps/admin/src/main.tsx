import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { router } from './router';
import { AuthProvider } from './providers/AuthProvider';
import { queryClient } from './lib/queryClient';
import { setUnauthorizedHandler, setRefreshTokenHandler, fetchClient } from './api/client';
import { useAuthStore } from './stores/auth';
import '@repo/ui/src/styles/globals.css';
import './index.css';

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

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
);
