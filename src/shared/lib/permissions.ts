import { type AuthUser, type UserRole } from './model/auth';

export type { AuthUser, UserRole };

/** 권한 판단에 필요한 최소 정보 — shared는 entities를 import할 수 없어 구조 타입으로 받음 (User·Operator 모두 해당) */
type User = { id: string; role?: UserRole };
type Operator = { id: string };

export interface Permissions {
  // User 관련 권한
  viewUser: (user?: User) => boolean;
  createUser: (user?: User) => boolean;
  updateUser: (user?: User) => boolean;
  deleteUser: (user?: User) => boolean;

  // Operator 관련 권한
  viewOperator: (operator?: Operator) => boolean;
  createOperator: (operator?: Operator) => boolean;
  updateOperator: (operator?: Operator) => boolean;
  deleteOperator: (operator?: Operator) => boolean;

  // Notification 관련 권한 (서버: MANAGE_NOTIFICATIONS — 조회도 포함)
  viewNotification: (notification?: unknown) => boolean;
  createNotification: (notification?: unknown) => boolean;
  updateNotification: (notification?: unknown) => boolean;

  // 시스템 (서버: MANAGE_SYSTEM)
  manageAppVersion: () => boolean;
  viewAuditLog: () => boolean;
}

const permissionsFactoryMap: Partial<Record<UserRole, (currentUser: AuthUser) => Permissions>> = {
  SUPER_ADMIN: (currentUser: AuthUser) => ({
    // User 권한
    viewUser: () => true,
    createUser: () => true,
    updateUser: (targetUser?: User) => !targetUser || targetUser.id !== currentUser.id,
    deleteUser: (targetUser?: User) => !targetUser || targetUser.id !== currentUser.id,

    // Operator 권한
    viewOperator: () => true,
    createOperator: () => true,
    updateOperator: (targetOperator?: Operator) => !targetOperator || targetOperator.id !== currentUser.id,
    deleteOperator: (targetOperator?: Operator) => !targetOperator || targetOperator.id !== currentUser.id,

    // Notification 권한
    viewNotification: () => true,
    createNotification: () => true,
    updateNotification: () => true,

    manageAppVersion: () => true,
    viewAuditLog: () => true,
  }),
  /**
   * 서버 ROLE_PERMISSIONS(noturi-server src/common/enums/permissions.enum.ts)와 맞춤 — 서버가 실제 권한을 정함
   * ADMIN: 사용자 조회·기본 카테고리 관리·대시보드만. 알림(조회 포함)·사용자 삭제·시스템 설정은 403
   */
  ADMIN: (currentUser: AuthUser) => ({
    // User 권한
    viewUser: () => true,
    createUser: () => true,
    updateUser: (targetUser?: User) => !targetUser || targetUser.role === 'USER' || targetUser.id === currentUser.id,
    deleteUser: () => false,

    // Operator 권한 (ADMIN은 다른 Operator 관리 불가)
    viewOperator: () => true,
    createOperator: () => false,
    updateOperator: (targetOperator?: Operator) => !targetOperator || targetOperator.id === currentUser.id,
    deleteOperator: () => false,

    // Notification 권한
    viewNotification: () => false,
    createNotification: () => false,
    updateNotification: () => false,

    manageAppVersion: () => false,
    viewAuditLog: () => false,
  }),
};

export function can(currentUser: AuthUser | { role: UserRole }): Permissions {
  const roles = 'roles' in currentUser ? currentUser.roles : [currentUser.role];
  const userRolePermissions = roles
    .map((role: UserRole) => permissionsFactoryMap[role]?.(currentUser as AuthUser))
    .filter(Boolean);

  return new Proxy({} as Permissions, {
    get(_target, action: keyof Permissions) {
      return <T extends User | Operator>(data?: T) =>
        userRolePermissions.some((permissions) => permissions?.[action]?.(data as User & Operator));
    },
  });
}
