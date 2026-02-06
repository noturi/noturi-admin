import type { Category, CreateCategoryRequest } from '@/entities/category/model/types';
import { CategoryService } from '@/features/category/model/category-service';

/**
 * 폼 값에서 카테고리 생성 요청 데이터로 변환
 */
export function buildCategoryData(values: {
  name: string;
  color: string;
  description?: string;
  sortOrder: number;
  isActive: boolean;
}): CreateCategoryRequest {
  return CategoryService.prepareCreateData({
    name: values.name,
    color: values.color,
    description: values.description || null,
    sortOrder: values.sortOrder,
    isActive: values.isActive,
  });
}

/**
 * Category에서 폼 defaultValues 생성
 */
export function getFormDefaultValues(category?: Category) {
  return {
    name: category?.name ?? '',
    color: category?.color ?? '#3B82F6',
    description: category?.description ?? '',
    sortOrder: category?.sortOrder ?? 0,
    isActive: category?.isActive ?? true,
  };
}
