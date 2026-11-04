import { getUserList } from '@/entities/user';
import { getSearchParams, PageType, toServerSort } from '@/shared/lib/utils/search-params';
import { auth } from '@/shared/lib/utils/auth.server';

import { UserTable } from './user-table';

/** 서버(/users)가 정렬할 수 있는 열 — 메모 수·카테고리 수는 집계 값이라 정렬 불가 */
export const USER_SORTABLE_COLUMNS = ['email', 'name', 'nickname', 'createdAt', 'lastActiveAt'] as const;

export async function UserListing() {
  const { user: currentUser } = await auth();
  if (!currentUser) return null; // layout에서 이미 로그인 화면으로 보냄

  const { cache } = getSearchParams(PageType.USER);
  const email = cache.get('email');
  const createdAt = cache.get('createdAt');
  const sort = toServerSort(cache.get('sort') as string | null, USER_SORTABLE_COLUMNS);

  const response = await getUserList({
    page: cache.get('page') as number,
    limit: cache.get('perPage') as number,
    ...(email && { email: email as string }),
    ...(createdAt && { createdAt: createdAt as string }),
    ...(sort && { sort }),
  });

  return (
    <UserTable
      data={response.data ?? []}
      pageCount={response.totalPages ?? 1}
      totalCount={response.total}
      currentUser={currentUser}
    />
  );
}
