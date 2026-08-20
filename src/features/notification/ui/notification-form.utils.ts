import type { Notification } from '@/entities/notification/model/types';
import type { CreateNotificationRequest, RepeatType } from '@/entities/notification/model/types';

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
  repeatType?: RepeatType;
  repeatDays?: number[];
  repeatMonthDays?: number[];
  sendOnLastDay?: boolean;
  repeatEndAt?: Date;
  skipHolidays?: boolean;
  targetUserIds: string[];
}): CreateNotificationRequest {
  const isCustomLink = values.screen === 'Custom';
  const parsedParams = parseJsonParams(values.params);

  const isRepeat = values.sendType === 'repeat';
  const repeatType: RepeatType = values.repeatType ?? 'WEEKLY';
  const isMonthly = isRepeat && repeatType === 'MONTHLY';
  const monthDays = values.repeatMonthDays ?? [];

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
    scheduledTime: isRepeat ? values.scheduledTime : undefined,
    isRepeat,
    repeatType: isRepeat ? repeatType : undefined,
    repeatDays: isRepeat ? (isMonthly ? monthDays : values.repeatDays) : undefined,
    // 말일 대체는 29~31일이 선택된 경우에만 의미 있음
    sendOnLastDay: isMonthly ? monthDays.some((d) => d >= 29) && (values.sendOnLastDay ?? false) : undefined,
    repeatEndAt: isRepeat ? values.repeatEndAt?.toISOString() : undefined,
    skipHolidays: isRepeat ? values.skipHolidays : undefined,
  };
}

/**
 * Notification에서 폼 defaultValues 생성
 */
export function getFormDefaultValues(notification?: Notification) {
  const hasLinkUrl = !!notification?.data.linkUrl;
  const repeatType: RepeatType = notification?.repeatType ?? 'WEEKLY';
  const isMonthly = repeatType === 'MONTHLY';
  return {
    title: notification?.title || '',
    body: notification?.body || '',
    screen: hasLinkUrl ? 'Custom' : notification?.data.screen || '',
    params: notification?.data.params ? JSON.stringify(notification.data.params) : '',
    linkUrl: notification?.data.linkUrl || '',
    sendType: getSendType(notification),
    scheduledAt: notification?.scheduledAt ? new Date(notification.scheduledAt) : undefined,
    scheduledTime: notification?.scheduledTime || '',
    repeatType,
    repeatDays: isMonthly ? [] : notification?.repeatDays || [],
    repeatMonthDays: isMonthly ? notification?.repeatDays || [] : [],
    sendOnLastDay: notification?.sendOnLastDay ?? false,
    repeatEndAt: notification?.repeatEndAt ? new Date(notification.repeatEndAt) : undefined,
    skipHolidays: notification?.skipHolidays ?? false,
    isActive: notification?.isActive ?? true,
    targetUserIds: notification?.targetUserIds || [],
  };
}
