'use server';

import { http } from '#http';
import logger from '@/shared/lib/utils/logger';
import type { Category, CategoryQueryParams } from '../model/types';

/**
 * 카테고리 목록 조회
 */
export async function getCategoryList(params?: CategoryQueryParams): Promise<Category[]> {
  logger.info('카테고리 목록 조회 요청', params);
  const categories = await http.get<Category[]>('/categories', {
    searchParams: params,
  });
  logger.info(`카테고리 목록 조회 완료: ${categories.length}건`, categories);
  return categories;
}

/**
 * 카테고리 상세 조회
 */
export async function getCategoryById(id: string): Promise<Category> {
  return http.get<Category>(`/categories/${id}`);
}
