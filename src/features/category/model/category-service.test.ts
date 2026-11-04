import { describe, expect, it } from 'vitest';
import { prepareCategoryData } from './category-service';

describe('prepareCategoryData', () => {
  it('이름·설명 공백을 지우고 색상을 대문자로, 빈 설명은 null', () => {
    expect(prepareCategoryData({ name: '  영화 ', description: '   ', color: '#ff6b6b' } as never)).toMatchObject({
      name: '영화',
      description: null,
      color: '#FF6B6B',
    });
  });
});
