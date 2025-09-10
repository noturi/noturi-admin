import { queryOptions } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/lib';
import { userApi } from './user-api';
import type { UserQueryParams } from '../model/types';

/**
 * 사용자 목록 조회 쿼리
 */
export const usersListQuery = (params?: UserQueryParams) =>
  queryOptions({
    queryKey: QUERY_KEYS.defaultUsers,
    queryFn: () => userApi.getList(params),
    staleTime: 5 * 60 * 1000, // 5분
  });

/**
 * 활성 사용자 목록 조회 쿼리
 */
export const activeUsersQuery = () =>
  queryOptions({
    queryKey: QUERY_KEYS.defaultUsersActive,
    queryFn: () => userApi.getList({ role: 'USER' }),
    staleTime: 5 * 60 * 1000, // 5분
  });

/**
 * 사용자 상세 조회 쿼리
 */
export const userDetailQuery = (id: string) =>
  queryOptions({
    queryKey: QUERY_KEYS.defaultUser(id),
    queryFn: () => userApi.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5분
  });
