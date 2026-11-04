export const ROUTES = {
  AUTH: {
    LOGIN: '/auth/login',
    /** 쿠키를 지우고 로그인 화면으로 보내는 경로 (app/auth/logout/route.ts) — API 401일 때 */
    SESSION_EXPIRED: '/auth/logout?reason=expired',
  },

  DASHBOARD: {
    HOME: '/dashboard',
    USER: '/dashboard/user',
    CATEGORY: '/dashboard/category',
    NOTIFICATION: '/dashboard/notification',
  },
} as const;
