import PageContainer from '@/shared/ui/page-container';
import { Heading } from '@/shared/ui/heading';
import { Separator } from '@/shared/ui/separator';
import { Button } from '@/shared/ui/button';
import { getSearchParams, PageType } from '@/shared/lib/utils/search-params';
import { SearchParams } from 'nuqs/server';
import { Suspense } from 'react';
import { DataTableSkeleton } from '@/shared/ui/table/data-table-skeleton';
import CategoryListingPage from '@/widgets/ui/category-listing';
import Link from 'next/link';

export const metadata = {
  title: 'Dashboard: Category',
};

type Props = {
  searchParams: Promise<SearchParams>;
};

export default async function Page(props: Props) {
  const searchParams = await props.searchParams;
  const { cache } = getSearchParams(PageType.CATEGORY);
  cache.parse(searchParams);

  return (
    <PageContainer scrollable={false}>
      <div className="flex flex-1 flex-col space-y-4">
        <div className="flex items-start justify-between">
          <Heading title="카테고리 관리" description="앱 카테고리" />
          <Link href="/dashboard/category/register">
            <Button>카테고리 등록</Button>
          </Link>
        </div>
        <Separator />
        <Suspense fallback={<DataTableSkeleton columnCount={6} rowCount={8} filterCount={2} />}>
          <CategoryListingPage />
        </Suspense>
      </div>
    </PageContainer>
  );
}
