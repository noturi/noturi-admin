import { cookies } from 'next/headers';
import { END_POINT } from '@/shared/lib';
import { EnhancedFetch } from './enhanced-fetch';

export function getServerApiWithAuth() {
  const cookieStore = cookies();
  const token = cookieStore.get('access_token')?.value;

  return new EnhancedFetch(END_POINT.BASE_URL || '', {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
}

export const serverApi = new EnhancedFetch(END_POINT.BASE_URL || '', {
  headers: {
    'Content-Type': 'application/json',
  },
});
