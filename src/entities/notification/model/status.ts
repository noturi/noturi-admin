import { formatKstLong, formatKstDate } from '@/shared/lib/utils/format-time';

import { formatRepeatSchedule, type Notification, type NotificationData } from './types';

/**
 * 알림의 실제 상태 — isActive만으로는 알 수 없음
 * 서버(cron) 동작: 1회 알림은 isActive && lastSentAt 없음 && 예약 시각이 지금 ±1분일 때만 발송, 발송 후 서버가 isActive를 끔
 * → 이미 보낸 1회 알림은 켜거나 시각을 바꿔도 다시 나가지 않음 / 꺼진 채로 예약 시각이 지나면 영영 안 나감
 */
export type NotificationStatus = 'scheduled' | 'repeating' | 'paused' | 'sent' | 'missed';

const MISSED_GRACE_MS = 60_000;

export function getNotificationStatus(
  n: Pick<Notification, 'isRepeat' | 'isActive' | 'scheduledAt' | 'lastSentAt'>,
  now: number = Date.now()
): NotificationStatus {
  if (n.isRepeat) return n.isActive ? 'repeating' : 'paused';
  if (n.lastSentAt || !n.scheduledAt) return 'sent';
  if (new Date(n.scheduledAt).getTime() < now - MISSED_GRACE_MS) return 'missed';
  return n.isActive ? 'scheduled' : 'paused';
}

export const NOTIFICATION_STATUS_LABEL: Record<NotificationStatus, string> = {
  scheduled: '예약됨',
  repeating: '반복 중',
  paused: '꺼짐',
  sent: '발송 완료',
  missed: '발송 안 됨',
};

/** 상태별로 할 수 있는 일 — 화면은 이 값으로 버튼을 감춤 */
export function getNotificationCapabilities(status: NotificationStatus) {
  return {
    /** 수정해도 다시 나가지 않는 상태(보낸 1회·놓친 1회)는 수정을 막음 */
    canEdit: status === 'scheduled' || status === 'repeating' || status === 'paused',
    canTurnOn: status === 'paused',
    canTurnOff: status === 'scheduled' || status === 'repeating',
  };
}

/** "매주 월 09:00 · 공휴일 제외" / "2026년 11월 10일 (화) 09:30" */
export function describeNotificationSchedule(
  n: Pick<
    Notification,
    | 'isRepeat'
    | 'scheduledAt'
    | 'scheduledTime'
    | 'repeatType'
    | 'repeatDays'
    | 'sendOnLastDay'
    | 'skipHolidays'
    | 'repeatEndAt'
  >
): string {
  if (n.isRepeat) {
    const days = formatRepeatSchedule(n.repeatType, n.repeatDays, n.sendOnLastDay);
    // 월간은 "매월 …"이 이미 붙어 있고, 매일·평일·주말은 그 자체로 읽힘
    const when = n.repeatType === 'MONTHLY' || ['매일', '평일', '주말'].includes(days) ? days : `매주 ${days}`;
    const parts = [`${when} ${n.scheduledTime ?? ''}`.trim()];
    if (n.skipHolidays) parts.push('공휴일 제외');
    if (n.repeatEndAt) parts.push(`${formatKstDate(n.repeatEndAt)}까지`);
    return parts.join(' · ');
  }
  return n.scheduledAt ? formatKstLong(n.scheduledAt) : '즉시';
}

/** 앱 화면 딥링크 이름 — 앱 라우트와 맞춰야 함 */
export const NOTIFICATION_SCREEN_LABELS: Record<string, string> = {
  Home: '홈',
  Memo: '메모',
  Calendar: '캘린더',
  Category: '카테고리',
  Settings: '설정',
  Custom: '직접 입력한 링크',
};

/** "앱 · 메모 화면" / "링크 · https://…" */
export function describeNotificationDestination(data: NotificationData | undefined): string {
  if (!data) return '-';
  if (data.screen === 'Custom') return data.linkUrl ? `링크 · ${data.linkUrl}` : '링크 없음';
  return `앱 · ${NOTIFICATION_SCREEN_LABELS[data.screen] ?? data.screen} 화면`;
}

/**
 * 발송 결과 한 줄 — 서버의 성공·실패는 기기(푸시 토큰) 수, 건너뜀은 사람 수
 * 아무도 못 받았거나 실패가 있으면 warning
 */
export function describeSendResult(result: {
  successCount: number;
  failCount: number;
  skippedNotificationOff?: number;
  skippedNoDevice?: number;
}): { tone: 'success' | 'warning'; message: string } {
  const skipped = (result.skippedNotificationOff ?? 0) + (result.skippedNoDevice ?? 0);
  const parts = [`기기 ${result.successCount.toLocaleString()}대에 보냈어요`];
  if (result.failCount > 0) parts.push(`실패 ${result.failCount.toLocaleString()}건`);
  if (skipped > 0) parts.push(`알림 끔·기기 없음으로 ${skipped.toLocaleString()}명 건너뜀`);
  return {
    tone: result.failCount > 0 || result.successCount === 0 ? 'warning' : 'success',
    message: parts.join(' · '),
  };
}
