import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: unknown) => {
        // Don't retry on 401 errors
        if (error && typeof error === 'object' && 'response' in error) {
          const errorWithResponse = error as { response?: { status?: number } };
          if (errorWithResponse.response?.status === 401) {
            return false;
          }
        }
        return failureCount < 3;
      },
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
    mutations: {
      retry: false, // Don't retry mutations by default
    },
  },
});
