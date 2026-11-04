'use server';

import { serverApi } from '@/shared/api/server-api';
import { revalidatePath } from 'next/cache';
import { ROUTES } from '@/shared/lib/routes';
import type { CreateCategoryRequest, UpdateCategoryRequest } from '@/entities/category';

/**
 * 카테고리 생성
 */
export async function createCategory(data: CreateCategoryRequest) {
  await serverApi.post('/categories', { json: data });
  revalidatePath(ROUTES.DASHBOARD.CATEGORY);
}

/**
 * 카테고리 수정
 */
export async function updateCategory(id: string, data: UpdateCategoryRequest) {
  await serverApi.put(`/categories/${id}`, { json: data });
  revalidatePath(ROUTES.DASHBOARD.CATEGORY);
  revalidatePath(`${ROUTES.DASHBOARD.CATEGORY}/${id}/edit`);
}

/**
 * 카테고리 삭제
 */
export async function deleteCategory(id: string) {
  await serverApi.delete(`/categories/${id}`);
  revalidatePath(ROUTES.DASHBOARD.CATEGORY);
}

/**
 * 카테고리 정렬 순서 변경
 */
export async function reorderCategories(categories: { id: string; sortOrder: number }[]) {
  await serverApi.patch('/categories/reorder', { json: { categories } });
  revalidatePath(ROUTES.DASHBOARD.CATEGORY);
}
