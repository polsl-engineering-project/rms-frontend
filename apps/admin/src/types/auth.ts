import type { ROLES } from '../constants/auth';
import type { paths } from '@repo/api-client';

export type UserRole = ValueOf<typeof ROLES>;

export type CurrentUser = paths['/api/v1/users/me']['get']['responses']['200']['content']['*/*'];
