export const ROUTES = {
  // 인증
  AUTH: {
    LOGIN: '/auth/login',
  },

  // 대시보드
  DASHBOARD: {
    HOME: '/dashboard',
    USERS: '/dashboard/users',
    CATEGORIES: '/dashboard/categories',
    SETTINGS: '/dashboard/settings',
  },
} as const;
