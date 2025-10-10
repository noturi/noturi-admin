'use server';

import { redirect } from 'next/navigation';
import { clearAuthCookies } from '@/shared/lib/utils/cookie-utils';

export async function logoutAction() {
  await clearAuthCookies();
  redirect('/auth/login');
}
