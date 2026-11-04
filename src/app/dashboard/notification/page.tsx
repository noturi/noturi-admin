import { Suspense } from 'react';
import Link from 'next/link';
import { SearchParams } from 'nuqs/server';
import { Plus } from 'lucide-react';

import { NotificationListing } from '@/widgets/notification-listing';
import { ROUTES } from '@/shared/lib';
import { getSearchParams, PageType } from '@/shared/lib/utils/search-params';
import { Button } from '@/shared/ui/button';
import { PageHeader } from '@/shared/ui/heading';
import PageContainer from '@/shared/ui/page-container';
import { DataTableSkeleton } from '@/shared/ui/table/data-table-skeleton';

export const metadata = { title: '알림 관리 | Noturi Admin' };

export default async function Page(props: { searchParams: Promise<SearchParams> }) {
  const searchParams = await props.searchParams;
  getSearchParams(PageType.NOTIFICATION).cache.parse(searchParams);

  return (
    <PageContainer>
      <PageHeader
        title="알림 관리"
        description="앱 사용자 휴대폰으로 보내는 푸시 알림 — 예약·반복 일정과 발송 기록"
        actions={
          <Button nativeButton={false} render={<Link href={`${ROUTES.DASHBOARD.NOTIFICATION}/create`} />}>
            <Plus />
            알림 만들기
          </Button>
        }
      />
      <Suspense fallback={<DataTableSkeleton columnCount={6} rowCount={8} filterCount={2} />}>
        <NotificationListing />
      </Suspense>
    </PageContainer>
  );
}
