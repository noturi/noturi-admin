import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { formSchema } from './notification-form.schema';

const NOW = new Date(2026, 10, 4, 10, 0); // 2026-11-04 10:00 (로컬)

const base = {
  title: '제목',
  body: '내용',
  screen: 'Home',
  params: '',
  linkUrl: '',
  isActive: true,
  targetUserIds: ['u1'],
};

const issuesOf = (values: object) => {
  const result = formSchema.safeParse(values);
  return result.success ? [] : result.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`);
};

describe('알림 폼 검증', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);
  });
  afterEach(() => vi.useRealTimers());

  it('발송 방식을 고르지 않으면 막는다 (기본값이 즉시 발송이던 문제)', () => {
    expect(issuesOf({ ...base, sendType: '' })).toContain('sendType: 발송 방식을 고르세요');
  });

  it('[P0 회귀] 예약 발송인데 날짜가 없으면 막는다 — 서버가 즉시 발송해 버림', () => {
    const issues = issuesOf({ ...base, sendType: 'scheduled', scheduledTime: '09:00' });
    expect(issues).toContain('scheduledAt: 예약 날짜를 고르세요');
  });

  it('예약 시간이 없으면 막는다 (날짜만 보내면 자정 발송)', () => {
    const issues = issuesOf({ ...base, sendType: 'scheduled', scheduledAt: new Date(2026, 10, 5) });
    expect(issues).toContain('scheduledTime: 발송 시간을 입력하세요');
  });

  it('지난 시각 예약은 막는다 — 서버는 1분 이상 지난 예약을 영원히 보내지 않음', () => {
    const today = new Date(2026, 10, 4);
    expect(issuesOf({ ...base, sendType: 'scheduled', scheduledAt: today, scheduledTime: '09:59' })).toContain(
      'scheduledTime: 지금보다 이후 시각을 고르세요'
    );
    expect(issuesOf({ ...base, sendType: 'scheduled', scheduledAt: today, scheduledTime: '10:30' })).toEqual([]);
  });

  it('직접 링크는 http(s) 주소만, 화면 파라미터는 JSON 객체만', () => {
    expect(issuesOf({ ...base, sendType: 'immediate', screen: 'Custom', linkUrl: 'apps.apple.com' })).toContain(
      'linkUrl: http:// 또는 https://로 시작하는 주소를 입력하세요'
    );
    expect(issuesOf({ ...base, sendType: 'immediate', screen: 'Custom', linkUrl: 'https://noturi.app' })).toEqual([]);
    expect(issuesOf({ ...base, sendType: 'immediate', params: '[1,2]' })).toContain(
      'params: JSON 객체 형식이 아니에요 (예: {"id": "123"})'
    );
  });

  it('반복 종료일이 오늘보다 이전이면 막는다', () => {
    const issues = issuesOf({
      ...base,
      sendType: 'repeat',
      scheduledTime: '09:00',
      repeatType: 'WEEKLY',
      repeatDays: [1],
      repeatEndAt: new Date(2026, 10, 3),
    });
    expect(issues).toContain('repeatEndAt: 오늘 이후 날짜를 고르세요');
  });

  it('받는 사람이 없으면 막는다', () => {
    expect(issuesOf({ ...base, sendType: 'immediate', targetUserIds: [] })).toContain(
      'targetUserIds: 받는 사람을 1명 이상 고르세요'
    );
  });
});
