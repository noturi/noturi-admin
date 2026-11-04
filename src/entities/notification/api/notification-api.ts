import { http } from '#http';
import type { NotificationListResponse, NotificationQueryParams, NotificationDetail } from '../model/types';

/**
 * 알림 목록 조회
 */
export async function getNotificationList(params?: NotificationQueryParams): Promise<NotificationListResponse> {
  return http.get<NotificationListResponse>('/notifications', {
    searchParams: params,
  });
}

/**
 * 알림 상세 조회 (발송 로그 포함)
 */
export async function getNotificationById(id: string): Promise<NotificationDetail> {
  return http.get<NotificationDetail>(`/notifications/${id}`);
}
