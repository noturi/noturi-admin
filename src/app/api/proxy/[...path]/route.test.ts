import { NextRequest } from 'next/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const cookieStore = { get: vi.fn() };
vi.mock('next/headers', () => ({ cookies: async () => cookieStore }));
vi.mock('@/shared/lib/end-point', () => ({ END_POINT: { BASE_URL: 'https://api.test/api' } }));

const { GET } = await import('./route');

const call = (path: string[], search = '') =>
  GET(new NextRequest(`http://admin.test/api/proxy/${path.join('/')}${search}`), {
    params: Promise.resolve({ path }),
  });

describe('/api/proxy (브라우저 → 어드민 API GET 프록시)', () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    fetchMock.mockResolvedValue(
      new Response('{"data":[]}', { status: 200, headers: { 'Content-Type': 'application/json' } })
    );
    vi.stubGlobal('fetch', fetchMock);
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it('쿠키의 토큰을 붙여 /admin 경로로 전달하고 쿼리스트링을 유지한다', async () => {
    cookieStore.get.mockReturnValue({ value: 'tok' });
    const res = await call(['users'], '?limit=1&keyword=kim');

    expect(res.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.test/api/admin/users?limit=1&keyword=kim',
      expect.objectContaining({ headers: expect.objectContaining({ Authorization: 'Bearer tok' }) })
    );
  });

  it('토큰이 없으면 401이고 API를 부르지 않는다', async () => {
    cookieStore.get.mockReturnValue(undefined);
    expect((await call(['users'])).status).toBe(401);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('경로 조작(..)은 400이고 API를 부르지 않는다', async () => {
    cookieStore.get.mockReturnValue({ value: 'tok' });
    expect((await call(['..', 'auth', 'login'])).status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('API 응답 상태 코드를 그대로 돌려준다 (401이면 브라우저 구현이 세션 만료 처리)', async () => {
    cookieStore.get.mockReturnValue({ value: 'expired' });
    fetchMock.mockResolvedValue(new Response('{"statusCode":401}', { status: 401 }));
    expect((await call(['users'])).status).toBe(401);
  });
});
