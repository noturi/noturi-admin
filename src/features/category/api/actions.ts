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
