import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ProtectedLayout } from '../layouts/ProtectedLayout';
import { LoginPage } from '../pages/LoginPage';
import { HomePage } from '../pages/HomePage';
import { KitchenDashboard } from '../pages/KitchenDashboard';
import { WaiterDashboardPage } from '../pages/WaiterDashboardPage';
import { AdminPageLayout } from '../layouts/AdminPageLayout';
import { UserManagementPage } from '../pages/UserManagementPage';
import { MenuCategoriesPage } from '../pages/MenuCategoriesPage';
import { MenuItemsPage } from '../pages/MenuItemsPage';
import { NotFoundPage } from '../pages/NotFoundPage';

import { BillDetailsPage } from '../pages/BillDetailsPage';
import { WaiterMenuSelectionPage } from '../pages/WaiterMenuSelectionPage';
import { WaiterCreateBillPage } from '../pages/WaiterCreateBillPage';
import { BillsPage } from '../pages/BillsPage';
import { OrdersPage } from '../pages/OrdersPage';

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
        element: <HomePage />,
      },

      // Kitchen Staff - Single page with all controls
      {
        path: 'kitchen',
        element: <KitchenDashboard />,
        handle: {
          allowedRoles: ['COOK', 'ADMIN', 'MANAGER'],
        },
      },

      // Waiter Interface
      {
        handle: {
          allowedRoles: ['WAITER', 'ADMIN', 'MANAGER'],
        },
        children: [
          {
            path: 'waiter',
            element: <WaiterDashboardPage />,
          },
          {
            path: 'waiter/create',
            element: <WaiterCreateBillPage />,
          },
          {
            path: 'waiter/bill/:id',
            element: <BillDetailsPage />,
          },
          {
            path: 'waiter/bill/:id/menu',
            element: <WaiterMenuSelectionPage />,
          },
        ],
      },

      // Manager/Admin Only
      {
        path: 'admin',
        element: <AdminPageLayout />,
        handle: {
          allowedRoles: ['ADMIN', 'MANAGER'],
        },
        children: [
          {
            index: true,
            element: <Navigate to="/admin/users" replace />,
          },
          {
            path: 'users',
            element: <UserManagementPage />,
          },
          {
            path: 'categories',
            element: <MenuCategoriesPage />,
          },
          {
            path: 'items',
            element: <MenuItemsPage />,
          },
          {
            path: 'orders',
            element: <OrdersPage />,
          },
          {
            path: 'bills',
            element: <BillsPage />,
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);
