import { cookies } from 'next/headers';
import { AuthUser } from '@/shared/lib/permissions';

export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 60 * 60 * 24 * 7, // 7 days
};

/**
 * 토큰 남은 수명(초) — 쿠키를 토큰과 같이 만료시켜, 토큰이 끝났는데 쿠키만 남아 대시보드에 들어가지는 일을 막음
 * (서버 액세스 토큰 기본 15분, 갱신 토큰 없음) exp를 읽지 못하면 기본값(7일)
 */
export function getTokenMaxAge(accessToken: string, now: number = Date.now()): number {
  try {
    const payload = JSON.parse(Buffer.from(accessToken.split('.')[1] ?? '', 'base64url').toString('utf8'));
    if (typeof payload.exp === 'number') {
      return Math.max(0, Math.floor(payload.exp - now / 1000));
    }
  } catch {
    // 형식이 다른 토큰 — 기본값 사용
  }
  return COOKIE_OPTIONS.maxAge;
}

export async function setAuthCookies(accessToken: string, user: AuthUser) {
  const cookieStore = await cookies();
  const options = { ...COOKIE_OPTIONS, maxAge: getTokenMaxAge(accessToken) };

  cookieStore.set('auth-token', accessToken, options);
  cookieStore.set('user-info', JSON.stringify(user), options);
}

export async function clearAuthCookies() {
  const cookieStore = await cookies();

  cookieStore.delete('auth-token');
  cookieStore.delete('user-info');
}
