import { describe, expect, it } from 'vitest';
import { buildNotificationData, describeSchedule, getSendType, parseJsonParams } from './notification-form.utils';

const base = { title: '제목', body: '본문', screen: 'Home', targetUserIds: ['u1'] };

describe('buildNotificationData', () => {
  it('즉시 발송은 예약·반복 필드를 보내지 않는다', () => {
    const data = buildNotificationData({ ...base, sendType: 'immediate' });
    expect(data).toMatchObject({
      isRepeat: false,
      scheduledAt: undefined,
      repeatType: undefined,
      repeatDays: undefined,
    });
  });

  it('매월 반복은 선택한 날짜를 repeatDays로 보내고, 29~31일이 있을 때만 말일 대체를 켠다', () => {
    const monthly = (repeatMonthDays: number[]) =>
      buildNotificationData({
        ...base,
        sendType: 'repeat',
        repeatType: 'MONTHLY',
        repeatMonthDays,
        repeatDays: [1, 2],
        sendOnLastDay: true,
      });

    expect(monthly([31])).toMatchObject({ repeatType: 'MONTHLY', repeatDays: [31], sendOnLastDay: true });
    expect(monthly([15])).toMatchObject({ repeatDays: [15], sendOnLastDay: false });
  });

  it('매주 반복은 요일(repeatDays)을 보내고 말일 대체는 보내지 않는다', () => {
    const data = buildNotificationData({
      ...base,
      sendType: 'repeat',
      repeatType: 'WEEKLY',
      repeatDays: [1, 3],
      repeatMonthDays: [31],
    });
    expect(data).toMatchObject({ repeatDays: [1, 3], sendOnLastDay: undefined });
  });

  it('직접 링크(Custom)는 screen을 비우고 linkUrl만 보낸다', () => {
    const data = buildNotificationData({
      ...base,
      screen: 'Custom',
      linkUrl: 'https://noturi.app',
      params: '{"id":1}',
      sendType: 'immediate',
    });
    expect(data.data).toEqual({ screen: '', linkUrl: 'https://noturi.app' });
  });
});

describe('parseJsonParams', () => {
  it('잘못된 JSON이나 빈 값은 undefined', () => {
    expect(parseJsonParams('{"id":1}')).toEqual({ id: 1 });
    expect(parseJsonParams('{oops')).toBeUndefined();
    expect(parseJsonParams('')).toBeUndefined();
  });
});

describe('예약 시각 합치기·요약', () => {
  it('예약 발송은 날짜(0시)와 시간을 합쳐 보낸다', () => {
    const data = buildNotificationData({
      ...base,
      sendType: 'scheduled',
      scheduledAt: new Date(2026, 10, 5),
      scheduledTime: '09:30',
    });
    expect(data.scheduledAt).toBe(new Date(2026, 10, 5, 9, 30).toISOString());
  });

  it('발송 시점을 사람의 말로 요약한다', () => {
    expect(describeSchedule({ sendType: 'immediate' })).toBe('확인하면 바로 발송');
    expect(
      describeSchedule({ sendType: 'scheduled', scheduledAt: new Date(2026, 10, 5), scheduledTime: '09:30' })
    ).toBe('2026년 11월 5일 (목) 09:30');
    expect(
      describeSchedule({
        sendType: 'repeat',
        scheduledTime: '08:00',
        repeatType: 'WEEKLY',
        repeatDays: [3, 1],
        skipHolidays: true,
      })
    ).toBe('매주 월, 수 08:00 · 공휴일 제외');
    expect(describeSchedule({ sendType: '' })).toBeNull();
  });

  it('새 알림은 발송 방식을 비워 둔다', () => {
    expect(getSendType()).toBe('');
  });
});
