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
// User Detail (with related data)
// =================================================================================

export const UserSettingsSchema = z.object({
  theme: z.string(),
  language: z.string(),
  notification: z.boolean(),
});

export const CategoryFieldSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  createdAt: z.string(),
});

export const UserCategorySchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  color: z.string(),
  sortOrder: z.number(),
  fields: z.array(CategoryFieldSchema),
  createdAt: z.string(),
});

export const MemoCustomFieldSchema = z.object({
  fieldName: z.string(),
  value: z.string(),
});

export const UserMemoSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  content: z.string().optional(),
  rating: z.number().optional(),
  experienceDate: z.string().optional(),
  categoryName: z.string(),
  customFields: z.array(MemoCustomFieldSchema).optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const CalendarMemoSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  isAllDay: z.boolean(),
  hasNotification: z.boolean(),
  notifyBefore: z.string().optional(),
  notificationSent: z.boolean(),
  createdAt: z.string(),
});

export const DeviceSchema = z.object({
  id: z.string().uuid(),
  expoPushToken: z.string(),
  platform: z.string(),
  isActive: z.boolean(),
  createdAt: z.string(),
  lastActiveAt: z.string(),
});

export const UserDetailSchema = UserSchema.omit({ memoCount: true, categoryCount: true }).extend({
  settings: UserSettingsSchema.optional(),
  categories: z.array(UserCategorySchema),
  memos: z.array(UserMemoSchema),
  calendarMemos: z.array(CalendarMemoSchema),
  devices: z.array(DeviceSchema),
});

export type UserSettings = z.infer<typeof UserSettingsSchema>;
export type UserCategory = z.infer<typeof UserCategorySchema>;
export type UserMemo = z.infer<typeof UserMemoSchema>;
export type CalendarMemo = z.infer<typeof CalendarMemoSchema>;
export type Device = z.infer<typeof DeviceSchema>;
export type UserDetail = z.infer<typeof UserDetailSchema>;

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
  notification: z.boolean().optional(),
});

export type UserQueryParams = z.infer<typeof UserQueryParamsSchema>;
