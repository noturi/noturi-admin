import { getUserList } from '@/entities/user';
import { UserTable } from './user-table';
import { getSearchParams, PageType } from '@/shared/lib/utils/search-params';
import { auth } from '@/shared/lib/utils/auth.server';

export async function UserListing() {
  // Get current user from server
  const authData = await auth();

  if (!authData.user) {
    return <div>Unauthorized</div>;
  }

  // Get user-specific search params
  const { cache } = getSearchParams(PageType.USER);

  const page = cache.get('page');
  const email = cache.get('email');
  const name = cache.get('name');
  const limit = cache.get('perPage');
  const createdAt = cache.get('createdAt');

  const filters = {
    page,
    limit,
    ...(email && { email }),
    ...(name && { name }),
    ...(createdAt && { createdAt }),
  };

  const response = await getUserList(filters);

  const users = response.data ?? [];
  const pageCount = response.totalPages ?? 1;

  return <UserTable data={users} pageCount={pageCount} currentUser={authData.user} />;
}
