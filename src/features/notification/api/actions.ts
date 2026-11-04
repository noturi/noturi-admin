'use server';

import { serverApi } from '@/shared/api/server-api';
import { revalidatePath } from 'next/cache';
import { ROUTES } from '@/shared/lib/routes';
import type {
  CreateNotificationRequest,
  UpdateNotificationRequest,
  SendNotificationResponse,
} from '@/entities/notification';

/**
 * 알림 생성 (즉시/예약/반복 발송)
 */
export async function createNotification(data: CreateNotificationRequest) {
  // 즉시 발송이면 서버가 sendResult(성공·실패 건수)를 돌려줌 — 화면에서 결과를 보여주기 위해 반환
  const result = await serverApi.post<{ id: string | null; sendResult?: SendNotificationResponse }>('/notifications', {
    json: data,
  });
  revalidatePath(ROUTES.DASHBOARD.NOTIFICATION);
  return result;
}

/**
 * 알림 수정
 */
export async function updateNotification(id: string, data: UpdateNotificationRequest) {
  await serverApi.put(`/notifications/${id}`, { json: data });
  revalidatePath(ROUTES.DASHBOARD.NOTIFICATION);
  revalidatePath(`${ROUTES.DASHBOARD.NOTIFICATION}/${id}`);
}

/**
 * 알림 삭제
 */
export async function deleteNotification(id: string) {
  await serverApi.delete(`/notifications/${id}`);
  revalidatePath(ROUTES.DASHBOARD.NOTIFICATION);
}

/**
 * 알림 즉시 발송 (수동)
 */
export async function sendNotification(id: string): Promise<SendNotificationResponse> {
  const response = await serverApi.post<SendNotificationResponse>(`/notifications/${id}/send`);
  revalidatePath(ROUTES.DASHBOARD.NOTIFICATION);
  revalidatePath(`${ROUTES.DASHBOARD.NOTIFICATION}/${id}`);
  return response;
}
