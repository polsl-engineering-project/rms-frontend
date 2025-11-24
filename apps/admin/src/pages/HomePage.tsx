import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription } from '@repo/ui';
import { ArrowRight } from 'lucide-react';
import { RoleGuard } from '../components/RoleGuard';
import { roleArrayToRoleObject } from '../utils/roleArrayToRoleObject';
import { PORTALS } from '../constants/portals';

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
      <div className="flex w-full gap-8 max-w-5xl mx-auto">
        {PORTALS.map((portal) => (
          <RoleGuard key={portal.id} {...roleArrayToRoleObject(portal.roles)}>
            <button
              onClick={() => navigate(portal.path)}
              className="group relative overflow-hidden w-full rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-blue-500"
            >
              <Card className="h-full border-0">
                {/* Gradient Background */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${portal.color} opacity-10 group-hover:opacity-20 transition-opacity`}
                />

                {/* Content */}
                <CardHeader className="relative pt-12 pb-12 text-center">
                  {/* Icon */}
                  <div
                    className={`text-7xl mb-6 transform group-hover:scale-110 transition-transform flex justify-center ${portal.iconColor}`}
                  >
                    <portal.icon className="w-20 h-20" />
                  </div>

                  {/* Title */}
                  <CardTitle className="text-2xl mb-3 text-gray-900">{portal.title}</CardTitle>

                  {/* Description */}
                  <CardDescription className="text-base text-gray-600">
                    {portal.description}
                  </CardDescription>

                  {/* Arrow indicator on hover */}
                  <div className="mt-6 text-gray-400 group-hover:text-gray-600 transition-colors">
                    <ArrowRight className="w-6 h-6 mx-auto" />
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
