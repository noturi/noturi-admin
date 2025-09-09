import PageContainer from '@/shared/ui/page-container';

import { Heading } from '@/shared/ui/heading';
import { Separator } from '@/shared/ui/separator';

import { searchParamsCache } from '@/shared/lib/utils/search-params';

import { SearchParams } from 'nuqs/server';
import { Suspense } from 'react';

import { DataTableSkeleton } from '@/shared/ui/table/data-table-skeleton';

export const metadata = {
  title: 'Dashboard: Products',
};

type Props = {
  searchParams: Promise<SearchParams>;
};

export default async function Page(props: Props) {
  const searchParams = await props.searchParams;
  searchParamsCache.parse(searchParams);

  return (
    <PageContainer scrollable={false}>
      <div className="flex flex-1 flex-col space-y-4">
        <div className="flex items-start justify-between">
          <Heading title="사용자 관리" description="앱 사용자" />
        </div>
        <Separator />
        <Suspense fallback={<DataTableSkeleton columnCount={5} rowCount={8} filterCount={2} />}></Suspense>
      </div>
    </PageContainer>
  );
}
