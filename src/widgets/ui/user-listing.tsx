import { columns } from '@/entities/user/ui/uesrs-tables/columns';
import { userApi } from '@/entities/user/api/user-api';
import { UserTable } from '@/entities/user/ui/user-listing';
import { searchParamsCache } from '@/shared/lib';
import { UserQueryParams } from '@/entities/user/model/types';

type UserListingPage = Record<string, never>;

export default async function UserListingPage({}: UserListingPage) {
  // Showcasing the use of search params cache in nested RSCs
  const page = searchParamsCache.get('page') ?? 1;
  const keyword = searchParamsCache.get('keyword');
  const limit = searchParamsCache.get('perPage') ?? 20;
  const role = searchParamsCache.get('role');

  const filters = {
    page,
    limit,
    ...(keyword && { keyword }),
    ...(role && { role }),
  };

  const response = await userApi.getList(filters as UserQueryParams);
  const users = response.data;
  const totalUsers = response.total;

  return <UserTable data={users} totalItems={totalUsers} columns={columns} />;
}
