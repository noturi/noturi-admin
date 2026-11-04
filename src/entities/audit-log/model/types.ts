import { z } from 'zod';
import type { PaginatedResponse } from '@/shared/api/types';

/** 서버 AuditAction과 같은 값 (noturi-server src/modules/audit-logs/audit-action.enum.ts) */
export const AUDIT_ACTION_LABEL = {
  'notification.create': '알림 만듦',
  'notification.send-immediate': '알림 즉시 발송',
  'notification.send': '알림 지금 보내기',
  'notification.update': '알림 수정·켜고 끔',
  'notification.delete': '알림 삭제',
  'user.delete': '계정 삭제',
  'category.create': '카테고리 추가',
  'category.update': '카테고리 수정·켜고 끔',
  'category.delete': '카테고리 삭제',
  'category.reorder': '카테고리 순서',
  'operator.create': '운영자 등록',
  'app-version.update': '앱 버전 변경',
} as const;

export type AuditAction = keyof typeof AUDIT_ACTION_LABEL;

export const AuditLogSchema = z.object({
  id: z.string(),
  actorId: z.string(),
  actorEmail: z.string(),
  action: z.string(),
  targetType: z.enum(['notification', 'user', 'category', 'operator', 'app-version']),
  targetId: z.string().nullable(),
  summary: z.string(),
  metadata: z.record(z.string(), z.unknown()).nullable(),
  createdAt: z.string(),
});

export type AuditLog = z.infer<typeof AuditLogSchema>;
export type AuditLogListResponse = PaginatedResponse<AuditLog>;

export const AuditLogQueryParamsSchema = z.object({
  page: z.number().min(1).optional(),
  limit: z.number().min(1).max(100).optional(),
  action: z.string().optional(),
});
export type AuditLogQueryParams = z.infer<typeof AuditLogQueryParamsSchema>;

/** 되돌릴 수 없거나 사용자에게 바로 닿는 작업 — 목록에서 눈에 띄게 */
export const RISKY_AUDIT_ACTIONS: readonly string[] = [
  'notification.send-immediate',
  'notification.send',
  'user.delete',
  'app-version.update',
];
