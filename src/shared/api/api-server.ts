import ky from 'ky';
import { cookies } from 'next/headers';
import { API_BASE_URL } from './api';

// 서버용 API (토큰 포함)
export async function getServerApiWithAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth-token')?.value;

  return ky.create({
    prefixUrl: API_BASE_URL,
    timeout: 30000,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}

// 서버용 API (토큰 없이 - 로그인용)
export const serverApi = ky.create({
  prefixUrl: API_BASE_URL,
  timeout: 30000,
  headers: {
    'User-Agent': 'Mozilla/5.0 (compatible; NextJS/15.0)',
  },
});
