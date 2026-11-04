import { describe, expect, it } from 'vitest';
import {
  describeSendResult,
  describeNotificationDestination,
  describeNotificationSchedule,
  getNotificationCapabilities,
  getNotificationStatus,
} from './status';

const now = new Date('2026-11-04T00:00:00.000Z').getTime();
const future = '2026-11-10T00:30:00.000Z';
const past = '2026-11-01T00:00:00.000Z';

describe('getNotificationStatus', () => {
  it('보낸 1회 알림은 "발송 완료" — 다시 켜거나 수정해도 나가지 않으니 막음', () => {
    const status = getNotificationStatus(
      { isRepeat: false, isActive: false, scheduledAt: past, lastSentAt: past },
      now
    );
    expect(status).toBe('sent');
    expect(getNotificationCapabilities(status)).toEqual({ canEdit: false, canTurnOn: false, canTurnOff: false });
  });

  it('꺼진 채 예약 시각이 지난 1회 알림은 "발송 안 됨"', () => {
    expect(getNotificationStatus({ isRepeat: false, isActive: false, scheduledAt: past }, now)).toBe('missed');
  });

  it('예약 전 1회 알림: 켜짐이면 예약됨, 꺼짐이면 꺼짐', () => {
    expect(getNotificationStatus({ isRepeat: false, isActive: true, scheduledAt: future }, now)).toBe('scheduled');
    expect(getNotificationStatus({ isRepeat: false, isActive: false, scheduledAt: future }, now)).toBe('paused');
  });

  it('반복 알림은 보낸 적이 있어도 켜져 있으면 반복 중', () => {
    expect(getNotificationStatus({ isRepeat: true, isActive: true, lastSentAt: past }, now)).toBe('repeating');
    expect(getNotificationStatus({ isRepeat: true, isActive: false }, now)).toBe('paused');
  });
});

describe('describeNotificationSchedule', () => {
  it('1회 알림은 KST 날짜·시각', () => {
    expect(describeNotificationSchedule({ isRepeat: false, scheduledAt: future })).toBe('2026년 11월 10일 (화) 09:30');
  });

  it('주간 반복', () => {
    expect(
      describeNotificationSchedule({
        isRepeat: true,
        repeatType: 'WEEKLY',
        repeatDays: [3, 1],
        scheduledTime: '09:00',
        skipHolidays: true,
      })
    ).toBe('매주 월, 수 09:00 · 공휴일 제외');
    expect(
      describeNotificationSchedule({
        isRepeat: true,
        repeatType: 'WEEKLY',
        repeatDays: [1, 2, 3, 4, 5],
        scheduledTime: '08:00',
      })
    ).toBe('평일 08:00');
  });

  it('월간 반복', () => {
    expect(
      describeNotificationSchedule({
        isRepeat: true,
        repeatType: 'MONTHLY',
        repeatDays: [31],
        sendOnLastDay: true,
        scheduledTime: '20:00',
      })
    ).toBe('매월 31일 (없는 달은 말일) 20:00');
  });
});

describe('describeNotificationDestination', () => {
  it('앱 화면과 링크', () => {
    expect(describeNotificationDestination({ screen: 'Memo' })).toBe('앱 · 메모 화면');
    expect(describeNotificationDestination({ screen: 'Custom', linkUrl: 'https://example.com' })).toBe(
      '링크 · https://example.com'
    );
  });
});

describe('describeSendResult', () => {
  it('기기 수·실패·건너뛴 사람을 구분', () => {
    expect(
      describeSendResult({ successCount: 11, failCount: 1, skippedNotificationOff: 2, skippedNoDevice: 1 })
    ).toEqual({
      tone: 'warning',
      message: '기기 11대에 보냈어요 · 실패 1건 · 알림 끔·기기 없음으로 3명 건너뜀',
    });
    expect(describeSendResult({ successCount: 5, failCount: 0 })).toEqual({
      tone: 'success',
      message: '기기 5대에 보냈어요',
    });
  });

  it('아무도 못 받으면 warning', () => {
    expect(describeSendResult({ successCount: 0, failCount: 0, skippedNoDevice: 3 }).tone).toBe('warning');
  });
});
