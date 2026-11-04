import { redirect } from 'next/navigation';

import { can, type Permissions } from '../permissions';
import { ROUTES } from '../routes';
import { auth } from './auth.server';

/**
 * 권한이 없는 화면은 들어오자마자 대시보드로 — 화면을 다 보여준 뒤 서버 403을 받게 하지 않음
 * 섹션 layout.tsx에서 호출 (예: 알림은 서버 MANAGE_NOTIFICATIONS라 조회도 막힘)
 */
export async function requirePermission(permission: keyof Permissions) {
  const { user } = await auth();
  if (!user || !can(user)[permission]()) redirect(ROUTES.DASHBOARD.HOME);
  return user;
}
