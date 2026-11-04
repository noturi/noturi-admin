import { describe, expect, it } from 'vitest';
import { toServerSort } from './search-params';

describe('toServerSort', () => {
  const allowed = ['email', 'createdAt'];

  it('허용한 열만 서버로', () => {
    expect(toServerSort('[{"id":"createdAt","desc":true},{"id":"memoCount","desc":false}]', allowed)).toBe(
      '[{"id":"createdAt","desc":true}]'
    );
  });

  it('잘못된 값·빈 값은 undefined (서버 기본 정렬)', () => {
    expect(toServerSort(null, allowed)).toBeUndefined();
    expect(toServerSort('not json', allowed)).toBeUndefined();
    expect(toServerSort('[{"id":"memoCount","desc":true}]', allowed)).toBeUndefined();
    expect(toServerSort('[{"id":"email","desc":"yes"}]', allowed)).toBeUndefined();
  });

  it('추가 필드는 떼고 보냄', () => {
    expect(toServerSort('[{"id":"email","desc":false,"x":1}]', allowed)).toBe('[{"id":"email","desc":false}]');
  });
});
