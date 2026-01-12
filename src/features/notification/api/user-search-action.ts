'use server';

import { getUserList } from '@/entities/user/api/user-api';

export async function searchUsers(query?: string) {
  const response = await getUserList({
    limit: 100,
    notification: true,
    ...(query && { keyword: query }),
  });
  return response.data || [];
}
