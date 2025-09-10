import { api } from '@/shared/api';
import type { UserListResponse, UserQueryParams } from '../model/types';

export class UserApi {
  private readonly baseUrl = '/api/admin/users';

  async getList(params?: UserQueryParams): Promise<UserListResponse> {
    const searchParams = new URLSearchParams();

    if (params?.keyword) {
      searchParams.append('keyword', params.keyword);
    }
    if (params?.role) {
      searchParams.append('role', params.role);
    }
    if (params?.page) {
      searchParams.append('page', params.page.toString());
    }
    if (params?.limit) {
      searchParams.append('limit', params.limit.toString());
    }

    const url = searchParams.toString() ? `${this.baseUrl}?${searchParams.toString()}` : this.baseUrl;

    const response = await api.client.get(url);
    return response.json<UserListResponse>();
  }
}

export const userApi = new UserApi();