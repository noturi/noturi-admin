import { z } from 'zod';
import type { PaginatedResponse } from '@/shared/api/types';

// =================================================================================
// Notification Log Entity
// =================================================================================

export const NotificationLogSchema = z.object({
  id: z.string().uuid(),
  sentAt: z.string(),
  successCount: z.number(),
  failureCount: z.number(),
  details: z
    .object({
      failedTokens: z.array(z.string()).optional(),
    })
    .optional(),
});

export type NotificationLog = z.infer<typeof NotificationLogSchema>;

// =================================================================================
// Core Notification Entity
// =================================================================================

export const NotificationDataSchema = z.object({
  screen: z.string(),
  params: z.record(z.string(), z.unknown()).optional(),
  linkUrl: z.string().optional(),
});

export type NotificationData = z.infer<typeof NotificationDataSchema>;

export const NotificationSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  body: z.string(),
  data: NotificationDataSchema,
  targetUserIds: z.array(z.string()),
  targetUserCount: z.number(),
  scheduledAt: z.string().optional(),
  scheduledTime: z.string().optional(), // "09:00" 형식
  isRepeat: z.boolean(),
  repeatDays: z.array(z.number()).optional(), // [1,2,3,4,5] = 월~금
  repeatEndAt: z.string().optional(),
  isActive: z.boolean(),
  lastSentAt: z.string().optional(),
  createdBy: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Notification = z.infer<typeof NotificationSchema>;

// =================================================================================
// Notification Detail (with logs)
// =================================================================================

export const NotificationDetailSchema = NotificationSchema.extend({
  logs: z.array(NotificationLogSchema).optional(),
});

export type NotificationDetail = z.infer<typeof NotificationDetailSchema>;

// =================================================================================
// API Payloads & Responses
// =================================================================================

export type CreateNotificationRequest = {
  title: string;
  body: string;
  data: NotificationData;
  targetUserIds: string[];
  scheduledAt?: string;
  scheduledTime?: string;
  isRepeat: boolean;
  repeatDays?: number[];
  repeatEndAt?: string;
};

export type UpdateNotificationRequest = Partial<CreateNotificationRequest> & {
  isActive?: boolean;
};

export type NotificationResponse = Notification;
export type NotificationListResponse = PaginatedResponse<Notification>;

// 즉시 발송 응답
export type SendNotificationResponse = {
  success: boolean;
  successCount: number;
  failCount: number;
  message: string;
};

// =================================================================================
// API Query Parameters
// =================================================================================

export const NotificationQueryParamsSchema = z.object({
  isActive: z.boolean().optional(),
  isRepeat: z.boolean().optional(),
  page: z.number().min(1).optional(),
  limit: z.number().min(1).max(100).optional(),
});

export type NotificationQueryParams = z.infer<typeof NotificationQueryParamsSchema>;

// =================================================================================
// UI Helper Constants & Functions
// =================================================================================

export const REPEAT_DAYS_MAP: Record<number, string> = {
  0: '일',
  1: '월',
  2: '화',
  3: '수',
  4: '목',
  5: '금',
  6: '토',
};

export function formatRepeatDays(days?: number[]): string {
  if (!days || days.length === 0) return '-';
  if (days.length === 7) return '매일';

  const sortedDays = [...days].sort((a, b) => a - b);
  if (JSON.stringify(sortedDays) === JSON.stringify([1, 2, 3, 4, 5])) return '평일';
  if (JSON.stringify(sortedDays) === JSON.stringify([0, 6])) return '주말';

  return days.map((d) => REPEAT_DAYS_MAP[d]).join(', ');
}
