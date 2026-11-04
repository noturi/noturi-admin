/**
 * #http — 서버(RSC·Server Action)용 구현
 * 쿠키의 토큰을 붙여 API를 직접 부르고, 401이면 세션 만료 처리 (server-api.ts)
 */
export { serverApi as http } from '../server-api';
