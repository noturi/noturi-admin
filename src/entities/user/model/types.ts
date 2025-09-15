import { z } from 'zod';

export const UserSchema = z.object({
  id: z.string().uuid(),
  nickname: z.string(),
  email: z.string().email(),
  name: z.string(),
  avatarUrl: z.string().url().nullable(),
  providers: z.array(z.enum(['GOOGLE', 'APPLE', 'KAKAO', 'NAVER'])).optional(),
  isStatsPublic: z.boolean(),
  role: z.enum(['USER', 'ADMIN', 'SUPER_ADMIN']),
  memoCount: z.number().optional(),
  categoryCount: z.number().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type User = z.infer<typeof UserSchema>;

export type CreateUserRequest = Pick<User, 'nickname' | 'email' | 'name' | 'avatarUrl' | 'role'>;
export type UpdateUserRequest = Partial<CreateUserRequest>;
export type UserResponse = User;

export const UserListResponseSchema = z.object({
  data: z.array(UserSchema),
  meta: z.object({
    page: z.number(),
    limit: z.number(),
    totalItems: z.number(),
    totalPages: z.number(),
    hasNext: z.boolean(),
    hasPrev: z.boolean(),
  }),
});

export type UserListResponse = z.infer<typeof UserListResponseSchema>;

export const ApiErrorSchema = z.object({
  statusCode: z.number(),
  code: z.number(),
  message: z.string(),
  details: z.record(z.string(), z.any()).optional(),
});

export type ApiError = z.infer<typeof ApiErrorSchema>;

// Query Parameters Schema
export const UserQueryParamsSchema = z.object({
  keyword: z.string().optional(),
  role: z.enum(['USER', 'ADMIN', 'SUPER_ADMIN']).optional(),
  page: z.number().min(1).optional(),
  limit: z.number().min(1).max(100).optional(),
});

export type UserQueryParams = z.infer<typeof UserQueryParamsSchema>;
