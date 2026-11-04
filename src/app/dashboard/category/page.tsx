import { Suspense } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';

import { CategoryListing } from '@/widgets/category-listing';
import { ROUTES } from '@/shared/lib';
import { Button } from '@/shared/ui/button';
import { PageHeader } from '@/shared/ui/heading';
import PageContainer from '@/shared/ui/page-container';
import { DataTableSkeleton } from '@/shared/ui/table/data-table-skeleton';

export const metadata = { title: '기본 카테고리 | Noturi Admin' };

export default function Page() {
  return (
    <PageContainer>
      <PageHeader
        title="기본 카테고리"
        description="새로 가입한 사용자의 앱에 처음 만들어지는 카테고리"
        actions={
          <Button nativeButton={false} render={<Link href={`${ROUTES.DASHBOARD.CATEGORY}/register`} />}>
            <Plus />
            카테고리 추가
          </Button>
        }
      />
      <Suspense fallback={<DataTableSkeleton columnCount={6} rowCount={6} filterCount={0} />}>
        <CategoryListing />
      </Suspense>
    </PageContainer>
  );
}
