import { z } from 'zod';

// 1. Zod 스키마 정의
export const CategorySchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  color: z.string(),
  description: z.string().nullable(),
  sortOrder: z.number(),
  isActive: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// 2. 타입 추론해서 변수에 저장
export type Category = z.infer<typeof CategorySchema>;

// 3. Request/Response 타입들
export type CreateCategoryRequest = Pick<Category, 'name' | 'color' | 'description' | 'sortOrder' | 'isActive'>;

export type UpdateCategoryRequest = Partial<CreateCategoryRequest>;

export type CategoryResponse = Category;

export type CategoriesListResponse = Category[];

// API 에러 타입
export const ApiErrorSchema = z.object({
  statusCode: z.number(),
  code: z.number(),
  message: z.string(),
  details: z.record(z.string(), z.any()).optional(),
});

export type ApiError = z.infer<typeof ApiErrorSchema>;

// Query Parameters
export type CategoryQueryParams = {
  isActive?: boolean;
  sortBy?: 'name' | 'sortOrder' | 'createdAt';
  order?: 'asc' | 'desc';
};
