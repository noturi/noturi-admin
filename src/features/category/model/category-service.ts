import type { CreateCategoryRequest } from '@/entities/category';

/** 저장 전 입력 정리 — 이름·설명 공백 제거, 색상 대문자 */
export function prepareCategoryData(data: CreateCategoryRequest): CreateCategoryRequest {
  return {
    ...data,
    name: data.name.trim(),
    description: data.description?.trim() || null,
    color: data.color.toUpperCase(),
  };
}
