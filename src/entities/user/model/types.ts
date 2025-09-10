import { z } from 'zod';

// 1. Zod 스키마 정의
export const UserSchema = z.object({
  id: z.string().uuid(),
  nickname: z.string(),
  email: z.string().email(),
  name: z.string(),
  avatarUrl: z.string().url().nullable(),
  providers: z.array(z.enum(['GOOGLE', 'APPLE', 'KAKAO', 'NAVER'])),
  isStatsPublic: z.boolean(),
  role: z.enum(['USER', 'ADMIN', 'SUPER_ADMIN']),
  memoCount: z.number(),
  categoryCount: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// 2. 타입 추론해서 변수에 저장
export type User = z.infer<typeof UserSchema>;

// 3. Request/Response 타입들
export type CreateUserRequest = Pick<User, 'nickname' | 'email' | 'name' | 'avatarUrl' | 'role'>;

export type UpdateUserRequest = Partial<CreateUserRequest>;

export type UserResponse = User;

// 페이지네이션 응답 스키마
export const UserListResponseSchema = z.object({
  data: z.array(UserSchema),
  page: z.number(),
  limit: z.number(),
  total: z.number(),
  totalPages: z.number(),
});

export type UserListResponse = z.infer<typeof UserListResponseSchema>;

// API 에러 타입
export const ApiErrorSchema = z.object({
  statusCode: z.number(),
  code: z.number(),
  message: z.string(),
  details: z.record(z.string(), z.any()).optional(),
});

export type ApiError = z.infer<typeof ApiErrorSchema>;

// Query Parameters
export type UserQueryParams = {
  keyword?: string;
  role?: 'USER' | 'ADMIN' | 'SUPER_ADMIN';
  page?: number;
  limit?: number;
};
