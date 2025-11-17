import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../stores/auth';

export function ProtectedLayout() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated());

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Render child routes if authenticated
  return <Outlet />;
}
