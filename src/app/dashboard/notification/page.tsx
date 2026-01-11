import PageContainer from '@/shared/ui/page-container';
import { Heading } from '@/shared/ui/heading';
import { Separator } from '@/shared/ui/separator';
import { Button } from '@/shared/ui/button';
import { getSearchParams, PageType } from '@/shared/lib/utils/search-params';
import { SearchParams } from 'nuqs/server';
import { Suspense } from 'react';
import { DataTableSkeleton } from '@/shared/ui/table/data-table-skeleton';
import NotificationListingPage from '@/widgets/ui/notification-listing';
import Link from 'next/link';
import { Plus } from 'lucide-react';

export const metadata = {
  title: 'Dashboard: Notification',
};

type Props = {
  searchParams: Promise<SearchParams>;
};

export default async function Page(props: Props) {
  const searchParams = await props.searchParams;
  const { cache } = getSearchParams(PageType.NOTIFICATION);
  cache.parse(searchParams);

  return (
    <PageContainer scrollable={false}>
      <div className="flex flex-1 flex-col space-y-4">
        <div className="flex items-start justify-between">
          <Heading title="알림 관리" description="푸시 알림 발송 및 관리" />
          <Link href="/dashboard/notification/create">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              알림 생성
            </Button>
          </Link>
        </div>
        <Separator />
        <Suspense fallback={<DataTableSkeleton columnCount={8} rowCount={8} filterCount={2} />}>
          <NotificationListingPage />
        </Suspense>
      </div>
    </PageContainer>
  );
}
