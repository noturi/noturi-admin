import { serverApi } from '@/shared/api/server-api';
import type { UserListResponse, UserQueryParams } from '../model/types';

export const userApi = {
  getList: async (params?: UserQueryParams): Promise<UserListResponse> => {
    return serverApi
      .get('/users', {
        searchParams: params as Record<string, string>,
      })
      .then((res) => res.json<UserListResponse>());
  },
};
