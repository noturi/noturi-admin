import { getOperatorList } from '@/entities/operator/api/operator-api';
import { OperatorTable } from '@/entities/operator/ui/operator-listing';
import { OperatorQueryParams } from '@/entities/operator/model/types';
import { auth } from '@/shared/lib/utils/auth.server';
import { getSearchParams, PageType } from '@/shared/lib/utils/search-params';

type OperatorListingPage = Record<string, never>;

export default async function OperatorListingPage({}: OperatorListingPage) {
  // Get current user from server
  const authData = await auth();

  if (!authData.user) {
    return <div>Unauthorized</div>;
  }

  // Get operator-specific search params
  const { cache } = getSearchParams(PageType.OPERATOR);

  const page = cache.get('page');
  const email = cache.get('email');
  const limit = cache.get('perPage');
  const role = cache.get('role');
  const createdAt = cache.get('createdAt');

  const filters = {
    page,
    limit,
    ...(email && { email }),
    ...(role && { role: role as OperatorQueryParams['role'] }),
    ...(createdAt && { createdAt }),
  };

  const response = await getOperatorList(filters);
  console.log(response);

  const operators = response.data ?? [];
  const pageCount = response.totalPages ?? 1;

  return <OperatorTable data={operators} pageCount={pageCount} currentUser={authData.user} />;
}
