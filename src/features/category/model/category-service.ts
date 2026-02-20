import type { CreateCategoryRequest } from '@/entities/category/model/types';

export class CategoryService {
  static prepareCreateData(data: CreateCategoryRequest): CreateCategoryRequest {
    return {
      ...data,
      name: data.name.trim(),
      description: data.description?.trim() || null,
      color: data.color.toUpperCase(),
    };
  }
}
