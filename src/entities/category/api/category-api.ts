import { http } from '#http';
import type { Category, CategoryQueryParams } from '../model/types';

/**
 * 카테고리 목록 조회
 */
export async function getCategoryList(params?: CategoryQueryParams): Promise<Category[]> {
  const categories = await http.get<Category[]>('/categories', {
    searchParams: params,
  });
  return categories;
}

/**
 * 카테고리 상세 조회
 */
export async function getCategoryById(id: string): Promise<Category> {
  return http.get<Category>(`/categories/${id}`);
}
