export const QUERY_KEYS = {
  // 사용자 관리
  users: ['users'] as const,
  user: (id: string) => ['user', id] as const,
  usersSearch: (query: string) => ['users', 'search', query] as const,
  usersByRole: (role: string) => ['users', 'role', role] as const,

  // 기본 카테고리 관리
  defaultCategories: ['default-categories'] as const,
  defaultCategory: (id: string) => ['default-category', id] as const,
  defaultCategoriesActive: ['default-categories', 'active'] as const,

  // 통계
  systemStats: ['system-stats'] as const,
  userStats: (userId: string) => ['user-stats', userId] as const,

  // 어드민 관리
  admins: ['admins'] as const,
  adminPermissions: ['admin-permissions'] as const,
} as const;
