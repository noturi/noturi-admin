import { queryOptions } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/lib/query-keys';
import { categoryApi } from './category-api';
import type { CategoryQueryParams } from '../model/types';

/**
 * 카테고리 목록 조회 쿼리
 */
export const categoriesListQuery = (params?: CategoryQueryParams) =>
  queryOptions({
    queryKey: QUERY_KEYS.defaultCategories,
    queryFn: () => categoryApi.getList(params),
    staleTime: 5 * 60 * 1000, // 5분
  });

/**
 * 활성 카테고리 목록 조회 쿼리
 */
export const activeCategoriesQuery = () =>
  queryOptions({
    queryKey: QUERY_KEYS.defaultCategoriesActive,
    queryFn: () => categoryApi.getList({ isActive: true }),
    staleTime: 5 * 60 * 1000, // 5분
  });

/**
 * 카테고리 상세 조회 쿼리
 */
export const categoryDetailQuery = (id: string) =>
  queryOptions({
    queryKey: QUERY_KEYS.defaultCategory(id),
    queryFn: () => categoryApi.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5분
  });
