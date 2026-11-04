import { describe, expect, it, vi } from 'vitest';
import { COOKIE_OPTIONS, getTokenMaxAge } from './cookie-utils';

vi.mock('next/headers', () => ({ cookies: vi.fn() }));

const tokenWith = (payload: object) => `h.${Buffer.from(JSON.stringify(payload)).toString('base64url')}.s`;

describe('getTokenMaxAge', () => {
  const now = Date.UTC(2026, 10, 4, 0, 0, 0);

  it('쿠키 수명을 토큰 만료(exp)까지 남은 시간으로 맞춘다 (쿠키 7일 vs 토큰 15분 회귀 방지)', () => {
    const exp = now / 1000 + 15 * 60;
    expect(getTokenMaxAge(tokenWith({ exp }), now)).toBe(15 * 60);
  });

  it('이미 만료된 토큰이면 0', () => {
    expect(getTokenMaxAge(tokenWith({ exp: now / 1000 - 10 }), now)).toBe(0);
  });

  it('exp가 없거나 형식이 다른 토큰이면 기본값(7일)', () => {
    expect(getTokenMaxAge(tokenWith({ sub: 'a' }), now)).toBe(COOKIE_OPTIONS.maxAge);
    expect(getTokenMaxAge('not-a-jwt', now)).toBe(COOKIE_OPTIONS.maxAge);
  });
});
