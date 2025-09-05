// Utils
export { cn } from './utils/utils';

// Hooks
export * from './hooks/use-mobile';

// Model (constants, types, etc.)
export * from './model/routes';
export * from './model/colors';
export * from './model/messages';
export * from './model/api';

// Config (auth, queries, etc.)
export * from './config/auth';
export * from './config/auth.server';
export * from './config/format-time';
export * from './config/http-error';
export * from './config/query-keys';

export const formatRole = (role: string) => {
  const roleMap = {
    USER: '사용자',
    ADMIN: '어드민',
    SUPER_ADMIN: '슈퍼어드민',
  };
  return roleMap[role as keyof typeof roleMap] || role;
};
