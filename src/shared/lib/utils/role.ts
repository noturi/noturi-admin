/** 역할 이름은 화면 전체에서 이 표기만 사용 (PRODUCT.md: 운영자 = 관리자·최고 관리자) */
export const ROLE_LABELS = {
  USER: '사용자',
  ADMIN: '관리자',
  SUPER_ADMIN: '최고 관리자',
} as const;

export const formatRole = (role: string) => ROLE_LABELS[role as keyof typeof ROLE_LABELS] ?? role;
