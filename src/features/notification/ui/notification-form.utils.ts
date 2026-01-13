import type { Notification } from '@/entities/notification/model/types';
import type { CreateNotificationRequest } from '@/entities/notification/model/types';

export type SendType = 'immediate' | 'scheduled' | 'repeat';

export const SCREEN_OPTIONS = [
  { value: 'Home', label: '홈' },
  { value: 'Memo', label: '메모' },
  { value: 'Calendar', label: '캘린더' },
  { value: 'Category', label: '카테고리' },
  { value: 'Settings', label: '설정' },
  { value: 'Custom', label: '커스텀 링크' },
] as const;

/**
 * Notification에서 발송 타입을 추출
 */
export function getSendType(notification?: Notification): SendType {
  if (!notification) return 'immediate';
  if (notification.isRepeat) return 'repeat';
  if (notification.scheduledAt) return 'scheduled';
  return 'immediate';
}

/**
 * JSON 문자열을 파싱 (에러 처리 포함)
 */
export function parseJsonParams(paramsString?: string): Record<string, unknown> | undefined {
  if (!paramsString) return undefined;
  try {
    return JSON.parse(paramsString);
  } catch {
    return undefined;
  }
}

/**
 * 폼 값에서 Notification API 요청 데이터로 변환
 */
export function buildNotificationData(values: {
  title: string;
  body: string;
  screen: string;
  params?: string;
  linkUrl?: string;
  sendType: SendType;
  scheduledAt?: Date;
  scheduledTime?: string;
  repeatDays?: number[];
  repeatEndAt?: Date;
  targetUserIds: string[];
}): CreateNotificationRequest {
  const isCustomLink = values.screen === 'Custom';
  const parsedParams = parseJsonParams(values.params);

  return {
    title: values.title,
    body: values.body,
    data: {
      screen: isCustomLink ? '' : values.screen,
      ...(!isCustomLink && parsedParams && { params: parsedParams }),
      ...(isCustomLink && values.linkUrl && { linkUrl: values.linkUrl }),
    },
    targetUserIds: values.targetUserIds,
    scheduledAt: values.sendType === 'scheduled' ? values.scheduledAt?.toISOString() : undefined,
    scheduledTime: values.sendType === 'repeat' ? values.scheduledTime : undefined,
    isRepeat: values.sendType === 'repeat',
    repeatDays: values.sendType === 'repeat' ? values.repeatDays : undefined,
    repeatEndAt: values.sendType === 'repeat' ? values.repeatEndAt?.toISOString() : undefined,
  };
}

/**
 * Notification에서 폼 defaultValues 생성
 */
export function getFormDefaultValues(notification?: Notification) {
  const hasLinkUrl = !!notification?.data.linkUrl;
  return {
    title: notification?.title || '',
    body: notification?.body || '',
    screen: hasLinkUrl ? 'Custom' : notification?.data.screen || '',
    params: notification?.data.params ? JSON.stringify(notification.data.params) : '',
    linkUrl: notification?.data.linkUrl || '',
    sendType: getSendType(notification),
    scheduledAt: notification?.scheduledAt ? new Date(notification.scheduledAt) : undefined,
    scheduledTime: notification?.scheduledTime || '',
    repeatDays: notification?.repeatDays || [],
    repeatEndAt: notification?.repeatEndAt ? new Date(notification.repeatEndAt) : undefined,
    isActive: notification?.isActive ?? true,
    targetUserIds: notification?.targetUserIds || [],
  };
}
