import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuthStore } from '../stores/auth';
import { useAuthActions } from '../hooks/useAuth';
import {
  Button,
  Avatar,
  AvatarFallback,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Badge,
  LogOut,
  ChevronDown,
} from '@repo/ui';

export function ProtectedLayout() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated());
  const user = useAuthStore((state) => state.user);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuthActions();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Get current page name from path
  const getPageName = () => {
    const path = location.pathname;
    if (path === '/') return 'Home';
    const segments = path.split('/').filter(Boolean);
    return segments[0]
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user?.firstName && !user?.lastName) return 'U';
    return `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase();
  };

  // Render child routes if authenticated
  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 to-slate-100 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-backdrop-filter:bg-white/60">
        <div className="mx-auto max-w-7xl flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Left: App Name & Location */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <h1
                className="text-xl font-bold text-slate-900 cursor-pointer transition-colors"
                onClick={() => navigate('/')}
              >
                RMS Admin
              </h1>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <div className="h-6 w-px bg-slate-300" />
              <Badge variant="outline" className="text-xs">
                {getPageName()}
              </Badge>
            </div>
          </div>

          {/* Right: User Menu */}
          <div className="flex items-center gap-4">
            {user && (
              <DropdownMenu onOpenChange={setIsDropdownOpen}>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 h-auto py-2 px-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-slate-200 text-slate-700 text-sm font-medium">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden md:flex flex-col items-start">
                      <span className="text-sm font-medium text-slate-900">
                        {user.firstName} {user.lastName}
                      </span>
                      {user.role && <span className="text-xs text-slate-500">{user.role}</span>}
                    </div>
                    <ChevronDown
                      className={`h-4 w-4 text-slate-500 ${isDropdownOpen ? 'rotate-180' : ''}`}
                    />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="z-100 bg-white mt-0.5 rounded-t-none">
                  <DropdownMenuItem
                    className="cursor-pointer w-[9.5rem] text-red-600 focus:text-red-700 focus:bg-red-50 py-3 px-4 "
                    onClick={() => logout()}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl w-full flex-1 flex py-8">
        <Outlet />
      </main>
    </div>
  );
}
