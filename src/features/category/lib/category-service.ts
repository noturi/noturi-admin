import type { Category, CreateCategoryRequest } from '@/entities/category/model/types';

/**
 * 카테고리 서비스 - 데이터 변환 및 비즈니스 로직 처리
 */
export class CategoryService {
  /**
   * 카테고리 목록을 sortOrder 순으로 정렬
   */
  static sortByOrder(categories: Category[]): Category[] {
    return [...categories].sort((a, b) => a.sortOrder - b.sortOrder);
  }

  /**
   * 활성 카테고리만 필터링
   */
  static filterActive(categories: Category[]): Category[] {
    return categories.filter((category) => category.isActive);
  }

  /**
   * 카테고리 생성 데이터 검증 및 변환
   */
  static prepareCreateData(data: CreateCategoryRequest): CreateCategoryRequest {
    return {
      ...data,
      name: data.name.trim(),
      description: data.description?.trim() || null,
      color: data.color.toUpperCase(),
    };
  }

  /**
   * 카테고리 색상 유효성 검증
   */
  static isValidColor(color: string): boolean {
    const hexColorRegex = /^#[0-9A-F]{6}$/i;
    return hexColorRegex.test(color);
  }

  /**
   * 카테고리 이름 중복 체크
   */
  static isDuplicateName(categories: Category[], name: string, excludeId?: string): boolean {
    return categories.some(
      (category) => category.name.toLowerCase() === name.toLowerCase() && category.id !== excludeId
    );
  }

  /**
   * 카테고리 표시용 데이터 변환
   */
  static toDisplayData(category: Category) {
    return {
      ...category,
      statusText: category.isActive ? '활성' : '비활성',
      createdAtFormatted: new Date(category.createdAt).toLocaleDateString('ko-KR'),
      updatedAtFormatted: new Date(category.updatedAt).toLocaleDateString('ko-KR'),
    };
  }

  /**
   * 다음 정렬 순서 계산
   */
  static getNextSortOrder(categories: Category[]): number {
    if (categories.length === 0) return 1;
    const maxOrder = Math.max(...categories.map((c) => c.sortOrder));
    return maxOrder + 1;
  }
}
