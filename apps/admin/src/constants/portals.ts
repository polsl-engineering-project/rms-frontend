import { ChefHat, Utensils, Settings } from 'lucide-react';
import { UserRole } from '../types';

export type Portal = {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  path: string;
  color: string;
  iconColor: string;
  roles: UserRole[];
};

export const PORTALS: Portal[] = [
  {
    id: 'kitchen',
    title: 'Kitchen Portal',
    description: 'View and manage kitchen orders',
    icon: ChefHat,
    path: '/kitchen',
    color: 'from-orange-500 to-red-600',
    iconColor: 'text-orange-600',
    roles: ['ADMIN', 'COOK', 'MANAGER'],
  },
  {
    id: 'waiter',
    title: 'Waiter Portal',
    description: 'Manage orders and tables',
    icon: Utensils,
    path: '/waiter',
    color: 'from-blue-500 to-indigo-600',
    iconColor: 'text-blue-600',
    roles: ['ADMIN', 'WAITER', 'MANAGER'],
  },
  {
    id: 'manager',
    title: 'Manager Portal',
    description: 'Administration and settings',
    icon: Settings,
    path: '/admin',
    color: 'from-purple-500 to-pink-600',
    iconColor: 'text-purple-600',
    roles: ['ADMIN', 'MANAGER'],
  },
];
