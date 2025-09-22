import { columns } from '@/entities/user/ui/uesrs-tables/columns';
import { getUserList } from '@/entities/user/api/user-api';
import { UserTable } from '@/entities/user/ui/user-listing';
import { searchParamsCache } from '@/shared/lib';
import { UserQueryParams } from '@/entities/user/model/types';

type UserListingPage = Record<string, never>;

export default async function UserListingPage({}: UserListingPage) {
  // Showcasing the use of search params cache in nested RSCs
  const page = searchParamsCache.get('page');
  const email = searchParamsCache.get('email');
  const limit = searchParamsCache.get('perPage');
  const role = searchParamsCache.get('role');
  const createdAt = searchParamsCache.get('createdAt');

  const filters = {
    page,
    limit,
    ...(email && { email }),
    ...(role && { role: role as UserQueryParams['role'] }),
    ...(createdAt && { createdAt }),
  };

  const response = await getUserList(filters);

  const users = response.data ?? [];
  const pageCount = response.totalPages ?? 1;

  return <UserTable data={users} pageCount={pageCount} columns={columns} />;
}
