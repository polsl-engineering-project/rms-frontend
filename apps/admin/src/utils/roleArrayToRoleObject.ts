import { UserRole } from '../types';

export const roleArrayToRoleObject = <T extends any = true>(roles: UserRole[], value?: T) => {
  return roles.reduce(
    (acc, role) => ({
      ...acc,
      [role.toLowerCase()]: value ?? true,
    }),
    {} as Record<Lowercase<UserRole>, T>
  );
};
