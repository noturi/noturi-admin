import { describe, expect, it } from 'vitest';
import { formatKstDate, formatKstDateTime, formatKstLong, formatKstTime, formatLastActive } from './format-time';

describe('KST 날짜 형식', () => {
  // UTC 2026-11-10 00:30 = KST 09:30
  const date = '2026-11-10T00:30:00.000Z';

  it('실행 환경 시간대와 상관없이 한국 시간으로 표시', () => {
    expect(formatKstDate(date)).toBe('2026. 11. 10.');
    expect(formatKstDateTime(date)).toBe('2026. 11. 10. 09:30');
    expect(formatKstTime(date)).toBe('09:30');
    expect(formatKstLong(date)).toBe('2026년 11월 10일 (화) 09:30');
    expect(formatKstLong(date, { withTime: false })).toBe('2026년 11월 10일 (화)');
  });

  it('UTC로는 전날이어도 KST 날짜로', () => {
    expect(formatKstDate('2026-11-09T16:00:00.000Z')).toBe('2026. 11. 10.');
  });

  it('자정은 00시로 (24시 아님)', () => {
    expect(formatKstTime('2026-11-09T15:00:00.000Z')).toBe('00:00');
  });
});

describe('formatLastActive', () => {
  // 기준: KST 2026-11-04 10:00
  const now = new Date('2026-11-04T01:00:00.000Z').getTime();

  it('KST 달력 기준으로 오늘·어제·N일 전', () => {
    expect(formatLastActive('2026-11-03T15:30:00.000Z', now)).toBe('오늘'); // KST 11/4 00:30
    expect(formatLastActive('2026-11-03T14:30:00.000Z', now)).toBe('어제'); // KST 11/3 23:30
    expect(formatLastActive('2026-10-30T03:00:00.000Z', now)).toBe('5일 전');
  });

  it('30일 이상이면 날짜', () => {
    expect(formatLastActive('2026-09-01T03:00:00.000Z', now)).toBe('2026. 9. 1.');
  });
});
