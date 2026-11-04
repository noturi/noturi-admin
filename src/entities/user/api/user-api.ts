import { http } from '#http';
import type { UserListResponse, UserQueryParams, UserDetail } from '../model/types';

export const getUserList = async (params?: UserQueryParams) => {
  return http.get<UserListResponse>('/users', {
    searchParams: {
      ...params,
      role: 'USER',
    },
  });
};

export const getUserById = async (id: string) => {
  return http.get<UserDetail>(`/users/${id}`);
};
