import { cookies } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';
import { END_POINT } from '@/shared/lib/end-point';

type Context = { params: Promise<{ path: string[] }> };

/**
 * 브라우저 → 어드민 API 프록시 (#http의 브라우저 구현이 사용, shared/api/http)
 * - httpOnly 쿠키의 토큰을 서버에서 붙여 전달 — 토큰은 브라우저 JS에 노출되지 않음
 * - 조회(GET)만 허용: 변경은 Server Action으로만 (프록시로 쓰기를 열면 쿠키만으로 데이터가 바뀌는 경로가 생김)
 */
export async function GET(request: NextRequest, { params }: Context) {
  const { path } = await params;
  if (path.some((segment) => segment === '..' || segment === '.' || segment.includes('\\'))) {
    return NextResponse.json({ statusCode: 400, message: 'Invalid path' }, { status: 400 });
  }

  const token = (await cookies()).get('auth-token')?.value;
  if (!token) {
    return NextResponse.json({ statusCode: 401, message: 'Unauthorized' }, { status: 401 });
  }

  const target = `${END_POINT.BASE_URL}/admin/${path.map(encodeURIComponent).join('/')}${request.nextUrl.search}`;
  const upstream = await fetch(target, {
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
    cache: 'no-store',
  });

  return new NextResponse(upstream.body, {
    status: upstream.status,
    headers: { 'Content-Type': upstream.headers.get('Content-Type') ?? 'application/json' },
  });
}
