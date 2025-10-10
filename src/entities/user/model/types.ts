import { z } from 'zod';
import { PaginatedResponse } from '@/shared/api/types';

// =================================================================================
// Core User Entity
// =================================================================================

export const UserSchema = z.object({
  id: z.string().uuid(),
  nickname: z.string(),
  email: z.string().email(),
  name: z.string(),
  avatarUrl: z.string().url().optional(),
  providers: z.array(z.enum(['GOOGLE', 'APPLE', 'KAKAO', 'NAVER'])).optional(),
  isStatsPublic: z.boolean(),
  role: z.enum(['USER', 'ADMIN', 'SUPER_ADMIN']),
  memoCount: z.number().optional(),
  categoryCount: z.number().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type User = z.infer<typeof UserSchema>;

// =================================================================================
// API Payloads & Responses
// =================================================================================

export type CreateUserRequest = Pick<User, 'nickname' | 'email' | 'name' | 'avatarUrl' | 'role'>;
export type UpdateUserRequest = Partial<CreateUserRequest>;
export type UserResponse = User;

// The actual API response for a list of users (flat structure)
export type UserListResponse = PaginatedResponse<User>;

// =================================================================================
// API Query Parameters
// =================================================================================

export const UserQueryParamsSchema = z.object({
  keyword: z.string().optional(),
  role: z.enum(['USER', 'ADMIN', 'SUPER_ADMIN']).optional(),
  page: z.number().min(1).optional(),
  limit: z.number().min(1).max(100).optional(),
  createdAt: z.string().optional(),
  sort: z.array(z.string()).optional(),
});

export type UserQueryParams = z.infer<typeof UserQueryParamsSchema>;
