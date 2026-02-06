'use server';

import { serverApi } from '@/shared/api/server-api';
import { revalidatePath } from 'next/cache';
import type { CreateCategoryRequest, UpdateCategoryRequest } from '@/entities/category/model/types';

/**
 * 카테고리 생성
 */
export async function createCategory(data: CreateCategoryRequest) {
  await serverApi.post('/categories', { json: data });
  revalidatePath('/dashboard/categories');
}

/**
 * 카테고리 수정
 */
export async function updateCategory(id: string, data: UpdateCategoryRequest) {
  await serverApi.put(`/categories/${id}`, { json: data });
  revalidatePath('/dashboard/categories');
}

/**
 * 카테고리 삭제
 */
export async function deleteCategory(id: string) {
  await serverApi.delete(`/categories/${id}`);
  revalidatePath('/dashboard/categories');
}

/**
 * 카테고리 활성/비활성 토글
 */
export async function toggleCategoryActive(id: string) {
  await serverApi.patch(`/categories/${id}/toggle-active`);
  revalidatePath('/dashboard/categories');
}

/**
 * 카테고리 정렬 순서 변경
 */
export async function reorderCategories(categories: { id: string; sortOrder: number }[]) {
  await serverApi.patch('/categories/reorder', { json: { categories } });
  revalidatePath('/dashboard/categories');
}
