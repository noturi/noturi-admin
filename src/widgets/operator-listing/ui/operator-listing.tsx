import { getOperatorList, type OperatorQueryParams } from '@/entities/operator';
import { auth } from '@/shared/lib/utils/auth.server';
import { getSearchParams, PageType, toServerSort } from '@/shared/lib/utils/search-params';

import { OperatorTable } from './operator-table';

const OPERATOR_SORTABLE_COLUMNS = ['email', 'name', 'nickname', 'role', 'createdAt'] as const;
const OPERATOR_ROLES = ['ADMIN', 'SUPER_ADMIN'] as const;

export async function OperatorListing() {
  const { user: currentUser } = await auth();
  if (!currentUser) return null;

  const { cache } = getSearchParams(PageType.OPERATOR);
  const email = cache.get('email') as string | null;
  const createdAt = cache.get('createdAt') as string | null;
  // URL에는 "ADMIN,SUPER_ADMIN" 한 문자열로 남음 → 배열로
  const roles = ((cache.get('role') as string | null) ?? '')
    .split(',')
    .filter((role): role is (typeof OPERATOR_ROLES)[number] => (OPERATOR_ROLES as readonly string[]).includes(role));
  const sort = toServerSort(cache.get('sort') as string | null, OPERATOR_SORTABLE_COLUMNS);

  const filters: OperatorQueryParams = {
    page: cache.get('page') as number,
    limit: cache.get('perPage') as number,
    ...(email && { email }),
    ...(roles.length && { role: roles }),
    ...(createdAt && { createdAt }),
    ...(sort && { sort }),
  };

  const response = await getOperatorList(filters);

  return (
    <OperatorTable
      data={response.data ?? []}
      pageCount={response.totalPages ?? 1}
      totalCount={response.total}
      currentUser={currentUser}
    />
  );
}
