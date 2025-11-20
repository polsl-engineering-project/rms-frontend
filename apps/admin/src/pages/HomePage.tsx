import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription } from '@repo/ui';
import { UserRole } from '../types';
import { RoleGuard } from '../components/RoleGuard';
import { roleArrayToRoleObject } from '../utils/roleArrayToRoleObject';

type Portal = {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  color: string;
  roles: UserRole[];
};

const portals: Portal[] = [
  {
    id: 'kitchen',
    title: 'Kitchen Portal',
    description: 'View and manage kitchen orders',
    icon: '👨‍🍳',
    path: '/kitchen',
    color: 'from-orange-500 to-red-600',
    roles: ['ADMIN', 'COOK', 'MANAGER'],
  },
  {
    id: 'waiter',
    title: 'Waiter Portal',
    description: 'Manage orders and tables',
    icon: '🍽️',
    path: '/waiter',
    color: 'from-blue-500 to-indigo-600',
    roles: ['ADMIN', 'WAITER', 'MANAGER'],
  },
  {
    id: 'manager',
    title: 'Manager Portal',
    description: 'Administration and settings',
    icon: '⚙️',
    path: '/admin',
    color: 'from-purple-500 to-pink-600',
    roles: ['ADMIN', 'MANAGER'],
  },
];

export function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="mx-auto my-auto h-full grow px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">Restaurant Management System</h1>
        <p className="text-xl text-gray-600">Select your portal to get started</p>
      </div>

      {/* Portal Cards */}
      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {portals.map((portal) => (
          <RoleGuard key={portal.id} {...roleArrayToRoleObject(portal.roles)}>
            <button
              onClick={() => navigate(portal.path)}
              className="group relative overflow-hidden rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-blue-500"
            >
              <Card className="h-full border-0">
                {/* Gradient Background */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${portal.color} opacity-10 group-hover:opacity-20 transition-opacity`}
                />

                {/* Content */}
                <CardHeader className="relative pt-12 pb-12 text-center">
                  {/* Icon */}
                  <div className="text-7xl mb-6 transform group-hover:scale-110 transition-transform">
                    {portal.icon}
                  </div>

                  {/* Title */}
                  <CardTitle className="text-2xl mb-3 text-gray-900">{portal.title}</CardTitle>

                  {/* Description */}
                  <CardDescription className="text-base text-gray-600">
                    {portal.description}
                  </CardDescription>

                  {/* Arrow indicator on hover */}
                  <div className="mt-6 text-gray-400 group-hover:text-gray-600 transition-colors">
                    <svg
                      className="w-6 h-6 mx-auto"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </div>
                </CardHeader>
              </Card>
            </button>
          </RoleGuard>
        ))}
      </div>

      {/* Quick Links */}
      <div className="mt-12 text-center">
        <div className="inline-flex gap-6 text-sm text-gray-600">
          <button
            onClick={() => navigate('/live-orders')}
            className="hover:text-gray-900 transition-colors"
          >
            Live Orders
          </button>
        </div>
      </div>
    </div>
  );
}
