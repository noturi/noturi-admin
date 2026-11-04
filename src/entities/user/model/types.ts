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
  /** 최근 접속일 — 서버가 하루 한 번 기록(날짜 단위 정밀도), 기록이 없으면 null */
  lastActiveAt: z.string().nullable().optional(),
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
  categories: z.array(UserCategorySchema).optional(),
  memos: z.array(UserMemoSchema).optional(),
  calendarMemos: z.array(CalendarMemoSchema).optional(),
  devices: z.array(DeviceSchema).optional(),
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
  email: z.string().optional(),
  role: z.enum(['USER', 'ADMIN', 'SUPER_ADMIN']).optional(),
  page: z.number().min(1).optional(),
  limit: z.number().min(1).max(100).optional(),
  createdAt: z.string().optional(),
  /** 이메일·이름·닉네임 검색 */
  keyword: z.string().optional(),
  /** JSON 문자열 `[{"id":"createdAt","desc":true}]` (toServerSort로 만듦) */
  sort: z.string().optional(),
  /** 서버 쿼리 이름은 notificationEnabled (예전 notification은 서버가 무시해 필터가 안 걸렸음) */
  notificationEnabled: z.boolean().optional(),
});

export type UserQueryParams = z.infer<typeof UserQueryParamsSchema>;

// =================================================================================
// 알림 대상 확인 (POST /users/lookup) · 대상 묶음 (GET /users/segment-ids)
// =================================================================================

/** 받을 수 있는지 — 서버 발송 코드와 같은 기준: 알림 켬 + 활성 기기 1대 이상 */
export const UserReachSchema = z.enum(['OK', 'NOTIFICATION_OFF', 'NO_DEVICE']);
export type UserReach = z.infer<typeof UserReachSchema>;

export const UserReachSummarySchema = z.object({
  total: z.number(),
  reachable: z.number(),
  notificationOff: z.number(),
  noDevice: z.number(),
  /** 탈퇴 등으로 이제 없는 사용자 */
  notFound: z.number(),
});
export type UserReachSummary = z.infer<typeof UserReachSummarySchema>;

export const UserLookupRowSchema = z.object({
  id: z.string(),
  name: z.string(),
  nickname: z.string(),
  email: z.string(),
  reach: UserReachSchema,
});
export type UserLookupRow = z.infer<typeof UserLookupRowSchema>;

export const UserLookupResponseSchema = z.object({
  summary: UserReachSummarySchema,
  users: z.array(UserLookupRowSchema).optional(),
});
export type UserLookupResponse = z.infer<typeof UserLookupResponseSchema>;

export const USER_SEGMENTS = [
  { value: 'ALL', label: '전체 사용자' },
  { value: 'INACTIVE_30D', label: '30일 넘게 안 들어온 사용자', hint: '접속 기록이 없는 사용자 포함' },
  { value: 'NEW_7D', label: '최근 7일 가입' },
  { value: 'NO_MEMO', label: '메모를 하나도 안 쓴 사용자' },
] as const;

export const UserSegmentSchema = z.enum(['ALL', 'INACTIVE_30D', 'NEW_7D', 'NO_MEMO']);
export type UserSegment = z.infer<typeof UserSegmentSchema>;

export const UserSegmentResponseSchema = z.object({
  segment: UserSegmentSchema,
  ids: z.array(z.string()),
  count: z.number(),
});
export type UserSegmentResponse = z.infer<typeof UserSegmentResponseSchema>;
