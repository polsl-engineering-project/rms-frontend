import { useLogout } from '../hooks/useAuth';
import { useAuthStore } from '../stores/auth';
import { Link } from 'react-router-dom';

export function DashboardPage() {
  const logout = useLogout();
  const getTimeUntilExpiry = useAuthStore((state) => state.getTimeUntilExpiry);
  const isTokenExpiringSoon = useAuthStore((state) => state.isTokenExpiringSoon);

  const timeRemaining = getTimeUntilExpiry();
  const minutes = timeRemaining ? Math.floor(timeRemaining / 60000) : 0;
  const seconds = timeRemaining ? Math.floor((timeRemaining % 60000) / 1000) : 0;

  const handleLogout = () => {
    logout.mutate();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              {isTokenExpiringSoon() && (
                <div className="text-sm bg-yellow-100 text-yellow-800 px-3 py-1 rounded">
                  ⚠️ Session expiring soon
                </div>
              )}
              <span className="text-sm text-gray-600">
                Session: {minutes}:{seconds.toString().padStart(2, '0')}
              </span>
              <button
                onClick={handleLogout}
                disabled={logout.isPending}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors disabled:opacity-50"
              >
                {logout.isPending ? 'Logging out...' : 'Logout'}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome to the Admin Portal</h2>
            <p className="text-gray-600">Manage your restaurant operations from this dashboard.</p>
          </div>

          {/* Quick Links Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link
              to="/users"
              className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow border border-gray-200"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Users</h3>
                <svg
                  className="w-8 h-8 text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <p className="text-gray-600 text-sm">Manage user accounts and permissions</p>
            </Link>

            <Link
              to="/menu"
              className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow border border-gray-200"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Menu</h3>
                <svg
                  className="w-8 h-8 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <p className="text-gray-600 text-sm">Update menu items and categories</p>
            </Link>

            <Link
              to="/orders"
              className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow border border-gray-200"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Orders</h3>
                <svg
                  className="w-8 h-8 text-purple-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                  />
                </svg>
              </div>
              <p className="text-gray-600 text-sm">View and manage customer orders</p>
            </Link>

            <Link
              to="/bills"
              className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow border border-gray-200"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Bills</h3>
                <svg
                  className="w-8 h-8 text-yellow-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a.5.5 0 11-1 0 .5.5 0 011 0zm5 5a.5.5 0 11-1 0 .5.5 0 011 0z"
                  />
                </svg>
              </div>
              <p className="text-gray-600 text-sm">Manage billing and payments</p>
            </Link>

            <Link
              to="/settings"
              className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow border border-gray-200"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Settings</h3>
                <svg
                  className="w-8 h-8 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <p className="text-gray-600 text-sm">Configure system settings</p>
            </Link>
          </div>

          {/* Status Card */}
          <div className="mt-8 bg-white p-6 rounded-lg shadow border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Authentication:</span>
                <span className="ml-2 text-green-600 font-semibold">✓ Active</span>
              </div>
              <div>
                <span className="text-gray-600">Auto-refresh:</span>
                <span className="ml-2 text-green-600 font-semibold">✓ Enabled</span>
              </div>
              <div>
                <span className="text-gray-600">API Status:</span>
                <span className="ml-2 text-green-600 font-semibold">✓ Connected</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
