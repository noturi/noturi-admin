import { http } from '#http';
import type { OperatorListResponse, OperatorQueryParams } from '../model/types';

export async function getOperatorList(params?: OperatorQueryParams) {
  const roles = params?.role || ['ADMIN', 'SUPER_ADMIN'];

  return await http.get<OperatorListResponse>('/users', {
    searchParams: {
      ...params,
      role: Array.isArray(roles) ? roles : [roles],
    },
  });
}
