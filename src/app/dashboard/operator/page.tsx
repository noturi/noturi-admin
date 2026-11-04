import { Suspense } from 'react';
import Link from 'next/link';
import { SearchParams } from 'nuqs/server';
import { Plus } from 'lucide-react';

import { OperatorListing } from '@/widgets/operator-listing';
import { auth, can, ROUTES } from '@/shared/lib';
import { getSearchParams, PageType } from '@/shared/lib/utils/search-params';
import { Button } from '@/shared/ui/button';
import { PageHeader } from '@/shared/ui/heading';
import PageContainer from '@/shared/ui/page-container';
import { DataTableSkeleton } from '@/shared/ui/table/data-table-skeleton';

export const metadata = { title: '운영자 관리 | Noturi Admin' };

export default async function Page(props: { searchParams: Promise<SearchParams> }) {
  const searchParams = await props.searchParams;
  getSearchParams(PageType.OPERATOR).cache.parse(searchParams);
  const { user } = await auth();

  return (
    <PageContainer>
      <PageHeader
        title="운영자 관리"
        description="어드민에 로그인할 수 있는 계정"
        actions={
          user &&
          can(user).createOperator() && (
            <Button nativeButton={false} render={<Link href={`${ROUTES.DASHBOARD.OPERATOR}/register`} />}>
              <Plus />
              운영자 등록
            </Button>
          )
        }
      />
      <Suspense fallback={<DataTableSkeleton columnCount={5} rowCount={8} filterCount={2} />}>
        <OperatorListing />
      </Suspense>
    </PageContainer>
  );
}
