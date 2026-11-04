import { format } from 'date-fns/format';
import { ko } from 'date-fns/locale/ko';
import type { Notification } from '@/entities/notification';
import type { CreateNotificationRequest, RepeatType } from '@/entities/notification';
import { REPEAT_DAYS_MAP } from '@/entities/notification';

export type SendType = 'immediate' | 'scheduled' | 'repeat';

export const SCREEN_OPTIONS = [
  { value: 'Home', label: '홈' },
  { value: 'Memo', label: '메모' },
  { value: 'Calendar', label: '캘린더' },
  { value: 'Category', label: '카테고리' },
  { value: 'Settings', label: '설정' },
  { value: 'Custom', label: '직접 입력한 링크' },
] as const;

export const SEND_TYPE_OPTIONS: { value: SendType; label: string; hint: string }[] = [
  { value: 'immediate', label: '즉시 발송', hint: '확인하면 바로 휴대폰으로 나감' },
  { value: 'scheduled', label: '예약 발송', hint: '정한 날짜·시간에 한 번' },
  { value: 'repeat', label: '반복 발송', hint: '매주 요일 또는 매월 날짜' },
];

/** 새 알림은 발송 방식을 비워 둬서 운영자가 반드시 고르게 함 (기본값 즉시 발송이면 실수로 바로 나감) */
export type FormSendType = SendType | '';

/** Notification에서 발송 타입을 추출 */
export function getSendType(notification?: Notification): FormSendType {
  if (!notification) return '';
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

/** 'HH:mm'이 올바른 시각인지 */
export function isValidClock(clock?: string): clock is string {
  return !!clock && /^([01]\d|2[0-3]):[0-5]\d$/.test(clock);
}

/** 날짜(그날 0시)와 'HH:mm'을 합친 시각 — 운영자 브라우저 시간대(한국) 기준 */
export function combineDateAndTime(date: Date, clock: string): Date {
  const [hours, minutes] = clock.split(':').map(Number);
  const result = new Date(date);
  result.setHours(hours, minutes, 0, 0);
  return result;
}

/** 발송 시점을 사람의 말로 — 미리보기 패널·확인 창에서 운영자가 검산 */
export function describeSchedule(values: {
  sendType: FormSendType;
  scheduledAt?: Date;
  scheduledTime?: string;
  repeatType?: RepeatType;
  repeatDays?: number[];
  repeatMonthDays?: number[];
  repeatEndAt?: Date;
  skipHolidays?: boolean;
}): string | null {
  const { sendType, scheduledTime } = values;
  if (sendType === 'immediate') return '확인하면 바로 발송';
  if (sendType === 'scheduled') {
    if (!values.scheduledAt || !isValidClock(scheduledTime)) return null;
    return format(combineDateAndTime(values.scheduledAt, scheduledTime), 'yyyy년 M월 d일 (EEE) HH:mm', { locale: ko });
  }
  if (sendType === 'repeat') {
    if (!isValidClock(scheduledTime)) return null;
    const base =
      values.repeatType === 'MONTHLY'
        ? (values.repeatMonthDays ?? []).length > 0
          ? `매월 ${(values.repeatMonthDays ?? []).map((d) => `${d}일`).join(', ')} ${scheduledTime}`
          : null
        : (values.repeatDays ?? []).length > 0
          ? `매주 ${[...(values.repeatDays ?? [])]
              .sort((a, b) => a - b)
              .map((d) => REPEAT_DAYS_MAP[d])
              .join(', ')} ${scheduledTime}`
          : null;
    if (!base) return null;
    const end = values.repeatEndAt ? ` · ${format(values.repeatEndAt, 'yyyy년 M월 d일', { locale: ko })}까지` : '';
    const holiday = values.skipHolidays ? ' · 공휴일 제외' : '';
    return base + end + holiday;
  }
  return null;
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
    // 예약: 날짜(0시) + 시간을 합쳐 보냄 — 날짜만 보내면 자정에 발송되고, 지난 시각은 서버가 영원히 보내지 않음
    scheduledAt:
      values.sendType === 'scheduled' && values.scheduledAt && isValidClock(values.scheduledTime)
        ? combineDateAndTime(values.scheduledAt, values.scheduledTime).toISOString()
        : undefined,
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
    // 예약 알림은 scheduledAt의 시각을 시간 입력칸으로 되돌림
    scheduledTime:
      notification?.scheduledTime ||
      (notification?.scheduledAt && !notification.isRepeat ? format(new Date(notification.scheduledAt), 'HH:mm') : ''),
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
