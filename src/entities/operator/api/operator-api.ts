import { serverApi } from '@/shared/api/server-api';
import { Operator, OperatorQueryParams } from '../model/types';

export async function getOperatorList(params?: OperatorQueryParams) {
  const roles = params?.role || ['ADMIN', 'SUPER_ADMIN'];

  return await serverApi.get<{
    data: Operator[];
    total: number;
    totalPages: number;
    currentPage: number;
  }>('/users', {
    searchParams: {
      ...params,
      role: Array.isArray(roles) ? roles : [roles],
    },
  });
}
