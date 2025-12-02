import type { ReactNode } from 'react';
import { useAuthStore } from '../../stores/auth';
import type { UserRole } from '../../types/auth';

type RoleGuardProps = {
  children: ReactNode;
  fallback?: ReactNode;
} & {
  [Role in UserRole as Lowercase<Role>]?: boolean;
};

export function RoleGuard({ children, fallback = null, ...roles }: RoleGuardProps) {
  const user = useAuthStore((state) => state.user);

  if (!user || !user.role) {
    return <>{fallback}</>;
  }

  const requiredRoles: UserRole[] = [];
  for (const [roleKey, isRequired] of Object.entries(roles)) {
    if (isRequired) {
      requiredRoles.push(roleKey.toUpperCase() as UserRole);
    }
  }

  if (requiredRoles.length === 0) {
    return <>{children}</>;
  }

  const hasAccess = requiredRoles.some((role) => user.role === role);

  return <>{hasAccess ? children : fallback}</>;
}
