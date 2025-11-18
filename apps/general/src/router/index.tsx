import { createBrowserRouter } from 'react-router-dom';
import { HomePage } from '../pages/HomePage';
import { MenuPage } from '../pages/MenuPage';
import { OrderCheckoutPage } from '../pages/OrderCheckoutPage';
import { OrderTrackingPage } from '../pages/OrderTrackingPage';
import { NotFoundPage } from '../pages/NotFoundPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/menu',
    children: [
      {
        index: true,
        element: <MenuPage />, // Auto-redirects to first category
      },
      {
        path: ':categoryId',
        element: <MenuPage />,
      },
    ],
  },
  {
    path: '/order',
    children: [
      {
        index: true,
        element: <OrderCheckoutPage />,
      },
      {
        path: ':orderId',
        element: <OrderTrackingPage />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);
