import { requirePermission } from '@/shared/lib/utils/require-permission.server';

/** 서버 권한이 없는 운영자(관리자)는 이 화면 전체에 들어오지 못함 */
export default async function Layout({ children }: { children: React.ReactNode }) {
  await requirePermission('viewAuditLog');
  return children;
}
