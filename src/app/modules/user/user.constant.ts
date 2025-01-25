import { TUserRoles } from './user.interface';

// Constant for user roles as an enum
export const USER_ROLE = {
  user: 'user',
  admin: 'admin',
} as const;

export const userRoles: TUserRoles[] = ['user', 'admin'];

// Constant for user searchable fields
export const userSearchableFields = ['name', 'email'];
