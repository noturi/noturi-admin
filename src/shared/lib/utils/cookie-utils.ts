import { cookies } from 'next/headers';
import { AuthUser } from '@/shared/lib/permissions';

export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 60 * 60 * 24 * 7, // 7 days
};

export async function setAuthCookies(accessToken: string, user: AuthUser) {
  const cookieStore = await cookies();

  cookieStore.set('auth-token', accessToken, COOKIE_OPTIONS);
  cookieStore.set('user-info', JSON.stringify(user), COOKIE_OPTIONS);
}

export async function clearAuthCookies() {
  const cookieStore = await cookies();

  cookieStore.delete('auth-token');
  cookieStore.delete('user-info');
}
