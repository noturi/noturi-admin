import { serverApi } from '@/shared/api/server-api';
import type { UserListResponse, UserQueryParams } from '../model/types';

export const getUserList = async (params?: UserQueryParams) => {
  return serverApi.get<UserListResponse>('/users', {
    searchParams: params,
  });
};
