import type { UserRole } from './auth';

export interface RouteHandle {
  allowedRoles?: UserRole[];
}
