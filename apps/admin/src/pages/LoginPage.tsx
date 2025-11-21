import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogin } from '../hooks/useAuth';
import { useAuthStore } from '../stores/auth';
import { InputBase, PasswordInput } from '../components/inputs';

export function LoginPage() {
  const navigate = useNavigate();
  const login = useLogin();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated());

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await login.mutateAsync({ username, password });
      // On success, the user will be redirected by the useEffect above
    } catch (error) {
      // Error is already logged and stored in login.error
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8">
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-900">Admin Login</h2>

          {login.error && (
            <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              <span className="block sm:inline">{login.error.message}</span>
            </div>
          )}

          <div className="mb-4">
            <InputBase
              id="username"
              name="username"
              label="Username"
              required
              showRequiredIndicator={false}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoFocus
              containerClassName="mb-0"
            />
          </div>

          <div className="mb-6">
            <PasswordInput
              id="password"
              name="password"
              label="Password"
              required
              showRequiredIndicator={false}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              containerClassName="mb-0"
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              type="submit"
              disabled={login.isPending}
              className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {login.isPending ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Logging in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </div>
        </form>

        <p className="text-center text-gray-600 text-sm mt-4">
          Restaurant Management System - Admin Portal
        </p>
      </div>
    </div>
  );
}
