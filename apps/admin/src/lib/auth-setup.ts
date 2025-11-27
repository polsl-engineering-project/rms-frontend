import { setUnauthorizedHandler } from '../api/client';
import { useAuthStore } from '../stores/auth';

export function setupAuthInterceptors() {
  // Handle 401 errors by clearing auth
  setUnauthorizedHandler(() => {
    const clearAuth = useAuthStore.getState().clearAuth;
    clearAuth();
    console.log('Session expired. Please log in again.');
  });
}
