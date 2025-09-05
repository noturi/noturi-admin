import { api } from '@/shared/api';
import type { Category, CreateCategoryRequest, UpdateCategoryRequest, CategoryQueryParams } from '../model/types';

/**
 * 카테고리 API - 순수 데이터 조회/변경만 담당
 */
export class CategoryApi {
  private readonly baseUrl = '/admin/categories';

  /**
   * 카테고리 목록 조회
   */
  async getList(params?: CategoryQueryParams): Promise<Category[]> {
    const searchParams = new URLSearchParams();

    if (params?.isActive !== undefined) {
      searchParams.append('isActive', params.isActive.toString());
    }
    if (params?.sortBy) {
      searchParams.append('sortBy', params.sortBy);
    }
    if (params?.order) {
      searchParams.append('order', params.order);
    }

    const url = searchParams.toString() ? `${this.baseUrl}?${searchParams.toString()}` : this.baseUrl;

    return api.client.get(url).json<Category[]>();
  }

  /**
   * 카테고리 상세 조회
   */
  async getById(id: string): Promise<Category> {
    return api.client.get(`${this.baseUrl}/${id}`).json<Category>();
  }

  /**
   * 카테고리 생성
   */
  async create(data: CreateCategoryRequest): Promise<Category> {
    return api.client.post(this.baseUrl, { json: data }).json<Category>();
  }

  /**
   * 카테고리 수정
   */
  async update(id: string, data: UpdateCategoryRequest): Promise<Category> {
    return api.client.put(`${this.baseUrl}/${id}`, { json: data }).json<Category>();
  }

  /**
   * 카테고리 삭제
   */
  async delete(id: string): Promise<void> {
    await api.client.delete(`${this.baseUrl}/${id}`);
  }
}

export const categoryApi = new CategoryApi();
