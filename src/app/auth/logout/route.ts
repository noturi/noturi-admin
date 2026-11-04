import { type NextRequest, NextResponse } from 'next/server';

/**
 * 세션 만료 처리 — 서버 컴포넌트는 쿠키를 지울 수 없어, 401이 나면 이 경로로 보내 쿠키를 지우고 로그인 화면으로 이동
 * (shared/api/server-api.ts의 SESSION_EXPIRED_PATH)
 */
export async function GET(request: NextRequest) {
  const loginUrl = new URL('/auth/login', request.url);
  if (request.nextUrl.searchParams.get('reason') === 'expired') {
    loginUrl.searchParams.set('reason', 'expired');
  }

  const response = NextResponse.redirect(loginUrl);
  response.cookies.delete('auth-token');
  response.cookies.delete('user-info');
  return response;
}
