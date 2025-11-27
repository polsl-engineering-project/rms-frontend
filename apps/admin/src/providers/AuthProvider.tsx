import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useAuthStore } from '../stores/auth';
import { useRefreshToken, useGetMe, useLogout } from '../hooks/useAuth';
import { SessionExpiryDialog } from '../components/auth/SessionExpiryDialog';

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
  const getTimeUntilExpiry = useAuthStore((state) => state.getTimeUntilExpiry);
  const isRefreshing = useAuthStore((state) => state.isRefreshing);
  const setUser = useAuthStore((state) => state.setUser);

  const refreshMutation = useRefreshToken();
  const logoutMutation = useLogout();
  const { data: userData } = useGetMe();
  const [isLoading, setIsLoading] = useState(true);
  const [isExpiryDialogOpen, setIsExpiryDialogOpen] = useState(false);

  // Update user in store when data is fetched
  useEffect(() => {
    if (userData) {
      setUser(userData);
    }
  }, [userData, setUser]);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  // Token expiry warning logic
  useEffect(() => {
    if (!isAuthenticated) {
      setIsExpiryDialogOpen(false);
      return;
    }

    const checkExpiry = () => {
      const timeUntilWarning = getTimeUntilWarning();

      // If timeUntilWarning is null, token might be missing or invalid
      if (timeUntilWarning === null) return;

      if (timeUntilWarning <= 0) {
        // We are past the warning threshold
        const isExpired = useAuthStore.getState().isTokenExpired();

        if (isExpired) {
          // Token expired, close dialog if open (user will be redirected by protected route)
          setIsExpiryDialogOpen(false);
          return;
        }

        // Token is in warning zone but not expired, show dialog
        if (isTokenExpiringSoon() && !isExpiryDialogOpen) {
          setIsExpiryDialogOpen(true);
        }
        return;
      }

      // Schedule check at warning threshold
      const timeoutId = setTimeout(() => {
        setIsExpiryDialogOpen(true);
      }, timeUntilWarning);

      return timeoutId;
    };

    const timeoutId = checkExpiry();

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isAuthenticated, getTimeUntilWarning, isTokenExpiringSoon, isExpiryDialogOpen]);

  const handleRefresh = async () => {
    try {
      await refreshMutation.mutateAsync();
      setIsExpiryDialogOpen(false);
    } catch (error) {
      console.error('Manual refresh failed:', error);
    }
  };

  const handleLogout = () => {
    logoutMutation.mutate();
    setIsExpiryDialogOpen(false);
  };

  const value: AuthContextValue = {
    isAuthenticated,
    isLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
      <SessionExpiryDialog
        isOpen={isExpiryDialogOpen}
        timeUntilExpiry={getTimeUntilExpiry() || 0}
        onRefresh={handleRefresh}
        onLogout={handleLogout}
        isRefreshing={isRefreshing}
      />
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
