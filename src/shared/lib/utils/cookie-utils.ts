import { cookies } from 'next/headers';

export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 60 * 60 * 24 * 7, // 7 days
};

export async function setAuthCookies(
  accessToken: string,
  user: { id: string; email: string; role: 'ADMIN' | 'SUPER_ADMIN' }
) {
  const cookieStore = await cookies();

  cookieStore.set('auth-token', accessToken, COOKIE_OPTIONS);
  cookieStore.set('user-info', JSON.stringify(user), COOKIE_OPTIONS);
}
