import { describe, expect, it } from 'vitest';
import { buildCategoryData, getNextSortOrder } from './category-form.utils';

describe('getNextSortOrder', () => {
  it('새 카테고리는 맨 뒤', () => {
    expect(getNextSortOrder([{ sortOrder: 1 }, { sortOrder: 5 }, { sortOrder: 3 }])).toBe(6);
  });
  it('하나도 없으면 1', () => {
    expect(getNextSortOrder([])).toBe(1);
  });
});

describe('buildCategoryData', () => {
  it('넘긴 순서를 그대로 쓰고 입력을 정리', () => {
    expect(buildCategoryData({ name: ' 영화 ', color: '#ff6b6b', description: '', isActive: true }, 4)).toEqual({
      name: '영화',
      color: '#FF6B6B',
      description: null,
      sortOrder: 4,
      isActive: true,
    });
  });
});
