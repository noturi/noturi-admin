import { Suspense } from 'react';
import { SearchParams } from 'nuqs/server';

import { AuditLogListing } from '@/widgets/audit-log-listing';
import { getSearchParams, PageType } from '@/shared/lib/utils/search-params';
import { PageHeader } from '@/shared/ui/heading';
import PageContainer from '@/shared/ui/page-container';
import { DataTableSkeleton } from '@/shared/ui/table/data-table-skeleton';

export const metadata = { title: '작업 기록 | Noturi Admin' };

export default async function AuditLogPage(props: { searchParams: Promise<SearchParams> }) {
  getSearchParams(PageType.AUDIT_LOG).cache.parse(await props.searchParams);

  return (
    <PageContainer>
      <PageHeader title="작업 기록" description="누가 언제 알림을 보내고, 계정·카테고리·앱 버전을 바꿨는지" />
      <Suspense fallback={<DataTableSkeleton columnCount={4} rowCount={10} filterCount={1} />}>
        <AuditLogListing />
      </Suspense>
    </PageContainer>
  );
}
