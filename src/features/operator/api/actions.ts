'use server';

import { revalidatePath } from 'next/cache';
import { serverApi } from '@/shared/api/server-api';
import { ROUTES } from '@/shared/lib/routes';

export async function deleteOperator(id: string) {
  await serverApi.delete(`/users/${id}`);
  revalidatePath(ROUTES.DASHBOARD.OPERATOR);
}
