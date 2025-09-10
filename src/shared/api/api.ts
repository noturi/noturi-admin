import { END_POINT } from '@/shared/lib';
import { EnhancedFetch } from './enhanced-fetch';

export const serverApi = new EnhancedFetch(END_POINT.BASE_URL || '', {
  headers: {
    'Content-Type': 'application/json',
  },
});

export const clientApi = new EnhancedFetch(END_POINT.BASE_URL || '', {
  headers: {
    'Content-Type': 'application/json',
  },
});

export const api = {
  client: clientApi,
  server: serverApi,
};
