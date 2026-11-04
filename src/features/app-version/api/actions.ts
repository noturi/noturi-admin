'use server';

import { revalidatePath } from 'next/cache';
import type { AppVersion, AppVersionInput } from '@/entities/app-version';
import { serverApi } from '@/shared/api/server-api';
import { ROUTES } from '@/shared/lib/routes';

export async function updateAppVersion(data: AppVersionInput) {
  const result = await serverApi.put<AppVersion>('/app-version', { json: data });
  revalidatePath(ROUTES.DASHBOARD.APP_VERSION);
  return result;
}
