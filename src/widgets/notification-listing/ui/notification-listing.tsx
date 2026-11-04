import { getNotificationList } from '@/entities/notification';
import { getSearchParams, PageType } from '@/shared/lib/utils/search-params';

import { NotificationTable } from './notification-table';

/** URL 필터 값("true"/"false")을 서버 쿼리(boolean)로 — 그 밖의 값은 무시 */
const toBoolean = (value: unknown) => (value === 'true' ? true : value === 'false' ? false : undefined);

export async function NotificationListing() {
  const { cache } = getSearchParams(PageType.NOTIFICATION);
  const isActive = toBoolean(cache.get('isActive'));
  const isRepeat = toBoolean(cache.get('isRepeat'));

  const response = await getNotificationList({
    page: cache.get('page') as number,
    limit: cache.get('perPage') as number,
    ...(isActive !== undefined && { isActive }),
    ...(isRepeat !== undefined && { isRepeat }),
  });

  return (
    <NotificationTable data={response.data ?? []} pageCount={response.totalPages ?? 1} totalCount={response.total} />
  );
}
