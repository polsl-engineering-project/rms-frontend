import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useAuthStore } from '../stores/auth';
import { useRefreshToken } from '../hooks/useAuth';

interface AuthContextValue {
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated());
  const isTokenExpiringSoon = useAuthStore((state) => state.isTokenExpiringSoon);
  const getTimeUntilWarning = useAuthStore((state) => state.getTimeUntilWarning);
  const isRefreshing = useAuthStore((state) => state.isRefreshing);

  const refreshMutation = useRefreshToken();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  // Automatic token refresh
  useEffect(() => {
    if (!isAuthenticated || isRefreshing) return;

    const scheduleRefresh = () => {
      const timeUntilWarning = getTimeUntilWarning();

      if (timeUntilWarning === null || timeUntilWarning === 0) {
        // Token is already in warning zone or expired, refresh immediately
        if (isTokenExpiringSoon()) {
          refreshMutation.mutateAsync().catch((error: Error) => {
            console.error('Auto-refresh failed:', error);
          });
        }
        return;
      }

      // Schedule refresh at warning threshold (3 min before expiry)
      const timeoutId = setTimeout(() => {
        refreshMutation
          .mutateAsync()
          .then(() => {
            // Reschedule for the new token
            scheduleRefresh();
          })
          .catch((error: Error) => {
            console.error('Auto-refresh failed:', error);
          });
      }, timeUntilWarning);

      return timeoutId;
    };

    const timeoutId = scheduleRefresh();

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isAuthenticated, isRefreshing, getTimeUntilWarning, isTokenExpiringSoon, refreshMutation]);

  const value: AuthContextValue = {
    isAuthenticated,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
