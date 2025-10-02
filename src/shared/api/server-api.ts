import { cookies } from 'next/headers';
import { END_POINT } from '@/shared/lib';
import { EnhancedFetch } from './enhanced-fetch';

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
  }
);
