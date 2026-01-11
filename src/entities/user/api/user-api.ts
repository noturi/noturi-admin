import { serverApi } from '@/shared/api/server-api';
import type { UserListResponse, UserQueryParams, UserDetail } from '../model/types';

export const getUserList = async (params?: UserQueryParams) => {
  return serverApi.get<UserListResponse>('/users', {
    searchParams: {
      ...params,
      role: 'USER',
    },
  });
};

export const getUserById = async (id: string) => {
  return serverApi.get<UserDetail>(`/users/${id}`);
};
