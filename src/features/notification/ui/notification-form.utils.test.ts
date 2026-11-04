import { describe, expect, it } from 'vitest';
import { buildNotificationData, parseJsonParams } from './notification-form.utils';

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
