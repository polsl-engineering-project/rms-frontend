import { createBrowserRouter } from 'react-router-dom';
import { ProtectedLayout } from '../layouts/ProtectedLayout';
import { LoginPage } from '../pages/LoginPage';
import { HomePage } from '../pages/HomePage';
import { KitchenViewPage } from '../pages/KitchenViewPage';
import { LiveOrdersPage } from '../pages/LiveOrdersPage';
import { WaiterDashboardPage } from '../pages/WaiterDashboardPage';
import { WaiterMenuPage } from '../pages/WaiterMenuPage';
import { OrderDetailsPage } from '../pages/OrderDetailsPage';
import { OrderHistoryPage } from '../pages/OrderHistoryPage';
import { UserManagementPage } from '../pages/UserManagementPage';
import { MenuManagementPage } from '../pages/MenuManagementPage';
import { NotFoundPage } from '../pages/NotFoundPage';

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

      // Order History
      {
        path: 'orders/history',
        element: <OrderHistoryPage />,
      },

      // Manager/Admin Only
      {
        path: 'admin/users',
        element: <UserManagementPage />,
      },
      {
        path: 'admin/menu',
        element: <MenuManagementPage />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);
