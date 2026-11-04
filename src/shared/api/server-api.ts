import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { END_POINT, ROUTES } from '@/shared/lib';
import { EnhancedFetch } from './enhanced-fetch';
import { HttpError } from '@/shared/lib/utils/http-error';

async function getTokenFromCookies() {
  const cookieStore = await cookies();
  return cookieStore.get('auth-token')?.value;
}

export const serverApi = new EnhancedFetch(
  END_POINT.BASE_URL + '/admin',
  {
    headers: {
      'Content-Type': 'application/json',
    },
  },
  async (options) => {
    const token = await getTokenFromCookies();
    return {
      ...options,
      headers: {
        ...options.headers,
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    };
  },
  async (error) => {
    // 토큰이 만료·무효 → 쿠키를 지우고 로그인 화면으로 (에러 화면에 멈추지 않게)
    if (error.response?.status === 401) redirect(ROUTES.AUTH.SESSION_EXPIRED);
    await HttpError.backend(error);
  }
);

/** 로그인·가입처럼 토큰 없이 부르는 API — 401은 "비밀번호 틀림"이라 세션 만료로 처리하지 않음 */
export const publicApi = new EnhancedFetch(END_POINT.BASE_URL + '/admin', {
  headers: {
    'Content-Type': 'application/json',
  },
});
