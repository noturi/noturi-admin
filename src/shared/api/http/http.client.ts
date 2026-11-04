import { ROUTES } from '@/shared/lib/routes';
import { EnhancedFetch } from '../enhanced-fetch';

/**
 * #http — 브라우저용 구현
 * 토큰 쿠키는 httpOnly이고 API는 다른 도메인이라 브라우저에서 직접 부를 수 없음 →
 * 같은 도메인의 /api/proxy(app/api/proxy)를 거쳐, 서버가 쿠키의 토큰을 붙여 전달한다.
 *
 * 주의: 'use client' 컴포넌트가 서버에서 렌더링될 때(SSR)도 이 구현이 쓰이는데, 상대 경로라 서버에서는 동작하지 않음 →
 * useEffect·이벤트 핸들러처럼 브라우저에서만 실행되는 곳에서 부를 것.
 */
export const http = new EnhancedFetch(
  '/api/proxy',
  { headers: { 'Content-Type': 'application/json' } },
  undefined,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      window.location.assign(ROUTES.AUTH.SESSION_EXPIRED);
    }
  }
);
