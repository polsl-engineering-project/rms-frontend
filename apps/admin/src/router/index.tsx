import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ProtectedLayout } from '../layouts/ProtectedLayout';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { NotFoundPage } from '../pages/NotFoundPage';

// Placeholder component for routes that aren't implemented yet
function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white shadow rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{title}</h1>
          <p className="text-gray-600">This page is under construction. Check back soon!</p>
          <a href="/dashboard" className="inline-block mt-4 text-blue-500 hover:text-blue-700">
            ← Back to Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: <ProtectedLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <DashboardPage />,
      },
      {
        path: 'users',
        element: <PlaceholderPage title="User Management" />,
      },
      {
        path: 'menu',
        element: <PlaceholderPage title="Menu Management" />,
      },
      {
        path: 'orders',
        element: <PlaceholderPage title="Order Management" />,
      },
      {
        path: 'bills',
        element: <PlaceholderPage title="Bill Management" />,
      },
      {
        path: 'settings',
        element: <PlaceholderPage title="Settings" />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);
