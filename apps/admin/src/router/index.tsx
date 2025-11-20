import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ProtectedLayout } from '../layouts/ProtectedLayout';
import { LoginPage } from '../pages/LoginPage';
import { HomePage } from '../pages/HomePage';
import { KitchenViewPage } from '../pages/KitchenViewPage';
import { LiveOrdersPage } from '../pages/LiveOrdersPage';
import { WaiterDashboardPage } from '../pages/WaiterDashboardPage';
import { WaiterMenuPage } from '../pages/WaiterMenuPage';
import { OrderDetailsPage } from '../pages/OrderDetailsPage';
import { AdminPageLayout } from '../layouts/AdminPageLayout';
import { UserManagementPage } from '../pages/UserManagementPage';
import { MenuCategoriesPage } from '../pages/MenuCategoriesPage';
import { MenuItemsPage } from '../pages/MenuItemsPage';
import { OrderHistoryPage } from '../pages/OrderHistoryPage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { RoleGuard } from '../components/RoleGuard';

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
        element: <KitchenViewPage />,
      },

      // Live Orders Management - Accept/Deny/Delay incoming orders
      {
        path: 'live-orders',
        element: <LiveOrdersPage />,
      },

      // Waiter Interface
      {
        path: 'waiter',
        element: <WaiterDashboardPage />,
      },
      {
        path: 'waiter/menu',
        element: <WaiterMenuPage />,
      },
      {
        path: 'waiter/orders/:orderId',
        element: <OrderDetailsPage />,
      },

      // Manager/Admin Only
      {
        path: 'admin',
        element: (
          <RoleGuard admin manager fallback={<Navigate to="/" replace />}>
            <AdminPageLayout />
          </RoleGuard>
        ),
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
            element: <OrderHistoryPage />,
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
