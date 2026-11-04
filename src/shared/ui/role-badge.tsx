import { formatRole } from '@/shared/lib';

import { Badge } from './badge';

const ROLE_VARIANT = { SUPER_ADMIN: 'default', ADMIN: 'secondary', USER: 'outline' } as const;

/** 역할 표시 — 사용자 상세·운영자 목록 등 모든 곳에서 같은 라벨·모양 */
export function RoleBadge({ role }: { role: string }) {
  return <Badge variant={ROLE_VARIANT[role as keyof typeof ROLE_VARIANT] ?? 'outline'}>{formatRole(role)}</Badge>;
}
