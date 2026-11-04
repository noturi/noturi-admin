import { describe, expect, it } from 'vitest';
import { compareVersions } from './types';

describe('compareVersions', () => {
  it('자리마다 숫자로 비교 (문자열 비교 아님)', () => {
    expect(compareVersions('1.5.10', '1.5.9')).toBe(1);
    expect(compareVersions('1.5.3', '1.5.3')).toBe(0);
    expect(compareVersions('1.4.9', '1.5.0')).toBe(-1);
  });
});
