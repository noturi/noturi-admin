'use server';

import { serverApi } from '@/shared/api/server-api';
import { revalidatePath } from 'next/cache';

export async function deleteOperator(id: string) {
  await serverApi.delete(`/users/${id}`);
  revalidatePath('/dashboard/operator');
}
