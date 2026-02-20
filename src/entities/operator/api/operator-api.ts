import { serverApi } from '@/shared/api/server-api';
import type { OperatorListResponse, OperatorQueryParams } from '../model/types';

export async function getOperatorList(params?: OperatorQueryParams) {
  const roles = params?.role || ['ADMIN', 'SUPER_ADMIN'];

  return await serverApi.get<OperatorListResponse>('/users', {
    searchParams: {
      ...params,
      role: Array.isArray(roles) ? roles : [roles],
    },
  });
}
