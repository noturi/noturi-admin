import { Suspense } from 'react';
import { SearchParams } from 'nuqs/server';

import { UserListing } from '@/widgets/user-listing';
import { getSearchParams, PageType } from '@/shared/lib/utils/search-params';
import { PageHeader } from '@/shared/ui/heading';
import PageContainer from '@/shared/ui/page-container';
import { DataTableSkeleton } from '@/shared/ui/table/data-table-skeleton';

export const metadata = { title: '사용자 관리 | Noturi Admin' };

export default async function Page(props: { searchParams: Promise<SearchParams> }) {
  const searchParams = await props.searchParams;
  getSearchParams(PageType.USER).cache.parse(searchParams);

  return (
    <PageContainer>
      <PageHeader title="사용자 관리" description="노트리 앱에 가입한 사용자 계정" />
      <Suspense fallback={<DataTableSkeleton columnCount={6} rowCount={8} filterCount={2} />}>
        <UserListing />
      </Suspense>
    </PageContainer>
  );
}
