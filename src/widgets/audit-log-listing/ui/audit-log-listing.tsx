import { AUDIT_ACTION_LABEL, getAuditLogs } from '@/entities/audit-log';
import { getSearchParams, PageType } from '@/shared/lib/utils/search-params';

import { AuditLogTable } from './audit-log-table';

export async function AuditLogListing() {
  const { cache } = getSearchParams(PageType.AUDIT_LOG);
  // 필터 값은 "notification.send" 한 개 — 서버가 아는 값만 넘김
  const action = (cache.get('action') as string | null) ?? undefined;
  const response = await getAuditLogs({
    page: cache.get('page') as number,
    limit: cache.get('perPage') as number,
    ...(action && action in AUDIT_ACTION_LABEL && { action }),
  });

  return <AuditLogTable data={response.data ?? []} pageCount={response.totalPages ?? 1} totalCount={response.total} />;
}
