import { describe, expect, it } from 'vitest';
import { formatKstDate, formatKstDateTime, formatKstLong, formatKstTime } from './format-time';

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
