/**
 * ProtectedRoute component
 * Ensures that only authenticated users can access certain routes
 */

import { type ReactNode } from 'react';
import { useAuth } from '../providers/AuthProvider';
import { useAuthStore } from '../stores/auth';

interface ProtectedRouteProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const { isLoading } = useAuth();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated());

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      fallback || (
        <div className="flex h-screen items-center justify-center">
          <div className="text-center">
            <h1 className="mb-4 text-2xl font-bold">Authentication Required</h1>
            <p className="text-gray-600">Please log in to access this page.</p>
          </div>
        </div>
      )
    );
  }

  return <>{children}</>;
}
