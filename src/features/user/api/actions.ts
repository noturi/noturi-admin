'use server';

import { serverApi } from '@/shared/api/server-api';
import { revalidatePath } from 'next/cache';

export async function deleteUser(id: string) {
  await serverApi.delete(`/users/${id}`);
  revalidatePath('/dashboard/users');
}
