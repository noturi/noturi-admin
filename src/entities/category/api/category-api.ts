'use server';

import { serverApi } from '@/shared/api/server-api';
import type { Category, CategoryQueryParams } from '../model/types';

/**
 * 카테고리 목록 조회
 */
export async function getCategoryList(params?: CategoryQueryParams): Promise<Category[]> {
  return serverApi.get<Category[]>('/categories', {
    searchParams: params,
  });
}

/**
 * 카테고리 상세 조회
 */
export async function getCategoryById(id: string): Promise<Category> {
  return serverApi.get<Category>(`/categories/${id}`);
}
