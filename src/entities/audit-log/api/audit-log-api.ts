import { http } from '#http';
import type { AuditLogListResponse, AuditLogQueryParams } from '../model/types';

/** 작업 기록 (최신순, 최고 관리자만) */
export async function getAuditLogs(params?: AuditLogQueryParams) {
  return http.get<AuditLogListResponse>('/audit-logs', { searchParams: params });
}
