import { useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchClient } from '../api/client';
import { useAuthStore } from '../stores/auth';
import type { paths } from '@repo/api-client';

// Type definitions from OpenAPI spec
type LoginRequest =
  paths['/api/v1/auth/login']['post']['requestBody']['content']['application/json'];
type LoginResponse =
  paths['/api/v1/auth/login']['post']['responses']['200']['content']['application/json'];

export const useLogin = () => {
  const setToken = useAuthStore((state) => state.setToken);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: LoginRequest) => {
      // Only clear auth state if user is not currently authenticated
      // This prevents logging out valid sessions during page refresh
      if (!isAuthenticated()) {
        clearAuth();
        queryClient.clear();
      }

      const { data, error } = await fetchClient.POST('/api/v1/auth/login', {
        body: credentials,
      });

      if (error) {
        throw new Error(error.message || 'Login failed');
      }

      if (!data?.accessToken) {
        throw new Error('No access token received');
      }

      return data;
    },
    onSuccess: (data: LoginResponse) => {
      // Store the access token (refresh token is in HTTP-only cookie)
      if (data.accessToken) {
        setToken(data.accessToken);
      }

      // Invalidate any cached queries on login
      queryClient.invalidateQueries();
    },
    onError: (error: Error) => {
      console.error('Login error:', error);
    },
  });
};

export const useLogout = () => {
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      // Call logout endpoint to clear refresh_token cookie on the server
      const { error } = await fetchClient.POST('/api/v1/auth/logout');

      if (error) {
        console.error('Logout endpoint error:', error);
        // Continue with local cleanup even if API call fails
      }

      // Clear client-side auth state and cache
      clearAuth();
      queryClient.clear();

      // Note: The server should clear the refresh_token cookie via Set-Cookie header
      // There's no way to manually delete HTTP-only cookies from JavaScript
    },
    onSuccess: () => {
      // State already cleared in mutationFn
      console.log('Logout successful');
    },
    onError: (error: Error) => {
      console.error('Logout error:', error);

      // Ensure local state is cleared even if API call failed
      clearAuth();
      queryClient.clear();
    },
  });
};

export const useRefreshToken = () => {
  const setToken = useAuthStore((state) => state.setToken);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const setIsRefreshing = useAuthStore((state) => state.setIsRefreshing);

  return useMutation({
    mutationFn: async () => {
      setIsRefreshing(true);

      // The refresh_token cookie is automatically sent by the browser
      const { data, error } = await fetchClient.POST('/api/v1/auth/refresh');

      if (error) {
        throw new Error(error.message || 'Token refresh failed');
      }

      if (!data?.accessToken) {
        throw new Error('No access token received');
      }

      return data;
    },
    onSuccess: (data: LoginResponse) => {
      // Store the new access token
      if (data.accessToken) {
        setToken(data.accessToken);
      }
      setIsRefreshing(false);
    },
    onError: (error: Error) => {
      console.error('Token refresh error:', error);

      // Clear auth state if refresh fails (user needs to login again)
      clearAuth();
      setIsRefreshing(false);
    },
  });
};

export const useAuthActions = () => {
  const login = useLogin();
  const logout = useLogout();
  const refreshToken = useRefreshToken();

  return {
    login: login.mutate,
    loginAsync: login.mutateAsync,
    logout: logout.mutate,
    logoutAsync: logout.mutateAsync,
    refreshToken: refreshToken.mutate,
    refreshTokenAsync: refreshToken.mutateAsync,
    isLoggingIn: login.isPending,
    isLoggingOut: logout.isPending,
    isRefreshing: refreshToken.isPending,
    loginError: login.error,
    logoutError: logout.error,
    refreshError: refreshToken.error,
  };
};
