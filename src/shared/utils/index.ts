export { cn } from '@/lib/utils';
export * from '../lib/format-time';
export * from '../constants';

export const formatRole = (role: string) => {
  const roleMap = {
    USER: '사용자',
    ADMIN: '어드민',
    SUPER_ADMIN: '슈퍼어드민',
  };
  return roleMap[role as keyof typeof roleMap] || role;
};
