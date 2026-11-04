import type { Category, CreateCategoryRequest } from '@/entities/category';
import { prepareCategoryData } from '../model/category-service';

export interface CategoryFormValues {
  name: string;
  color: string;
  description?: string;
  isActive: boolean;
}

/**
 * 폼 값 → 저장 요청. 순서(sortOrder)는 폼에서 받지 않음 — 목록에서 끌어서 정함
 * 새로 만들면 맨 뒤(nextSortOrder), 수정하면 기존 순서 유지
 */
export function buildCategoryData(values: CategoryFormValues, sortOrder: number): CreateCategoryRequest {
  return prepareCategoryData({
    name: values.name,
    color: values.color,
    description: values.description || null,
    sortOrder,
    isActive: values.isActive,
  });
}

export function getFormDefaultValues(category?: Category): CategoryFormValues {
  return {
    name: category?.name ?? '',
    color: category?.color ?? '#3B82F6',
    description: category?.description ?? '',
    isActive: category?.isActive ?? true,
  };
}

/** 맨 뒤 순서 — 기존 최댓값 + 1 (예전 기본값 0은 맨 앞에 끼어들었음) */
export function getNextSortOrder(categories: Pick<Category, 'sortOrder'>[]): number {
  return categories.reduce((max, c) => Math.max(max, c.sortOrder), 0) + 1;
}
