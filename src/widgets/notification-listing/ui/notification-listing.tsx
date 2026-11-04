import { getNotificationList } from '@/entities/notification';
import { NotificationTable } from './notification-table';
import { getSearchParams, PageType } from '@/shared/lib/utils/search-params';
import { auth } from '@/shared/lib/utils/auth.server';

export async function NotificationListing() {
  const authData = await auth();

  if (!authData.user) {
    return <div>Unauthorized</div>;
  }

  const { cache } = getSearchParams(PageType.NOTIFICATION);

  const page = cache.get('page');
  const limit = cache.get('perPage');

  // 서버 사이드 필터링 제거 - 클라이언트 사이드 필터링만 사용
  const filters = {
    page,
    limit,
  };

  const response = await getNotificationList(filters);

  const notifications = response.data ?? [];
  const pageCount = response.totalPages ?? 1;

  return <NotificationTable data={notifications} pageCount={pageCount} />;
}
