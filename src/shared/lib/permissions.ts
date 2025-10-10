import { User } from '@/entities/user/model/types';

export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'USER';

export type AuthUser = {
  id: string;
  roles: UserRole[];
};

interface UserPermissions {
  deleteUser: (targetUser: User) => boolean;
  updateUser: (targetUser: User) => boolean;
  viewUser: (targetUser: User) => boolean;
}

const permissionsFactoryMap: Record<UserRole, (currentUser: AuthUser) => UserPermissions> = {
  SUPER_ADMIN: (currentUser: AuthUser) => ({
    deleteUser: (targetUser: User) => targetUser.id !== currentUser.id,
    updateUser: (targetUser: User) => targetUser.id !== currentUser.id,
    viewUser: () => true,
  }),
  ADMIN: (currentUser: AuthUser) => ({
    deleteUser: (targetUser: User) => targetUser.role === 'USER',
    updateUser: (targetUser: User) => targetUser.role === 'USER' || targetUser.id === currentUser.id,
    viewUser: () => true,
  }),
  USER: () => ({
    deleteUser: () => false,
    updateUser: () => false,
    viewUser: () => true,
  }),
};

export function can(currentUser: AuthUser | { role: UserRole }): UserPermissions {
  const roles = 'roles' in currentUser ? currentUser.roles : [currentUser.role];
  const userRolePermissions = roles.map((role: UserRole) => permissionsFactoryMap[role](currentUser as AuthUser));

  return new Proxy({} as UserPermissions, {
    get(_target, action: keyof UserPermissions) {
      return (data: User) => userRolePermissions.some((permissions) => permissions[action](data));
    },
  });
}
