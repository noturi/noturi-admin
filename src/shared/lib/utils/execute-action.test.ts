import { describe, expect, it, vi } from 'vitest';

vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

import { executeAction } from './execute-action';

describe('executeAction', () => {
  it('void 액션이 성공하면 ok: true (undefined를 실패로 보지 않음)', async () => {
    const result = await executeAction(async () => {});
    expect(result.ok).toBe(true);
  });

  it('실패하면 ok: false', async () => {
    const result = await executeAction(async () => {
      throw new Error('x');
    });
    expect(result.ok).toBe(false);
  });

  it('성공하면 반환값을 data로 전달', async () => {
    const result = await executeAction(async () => ({ id: 'a' }));
    expect(result).toEqual({ ok: true, data: { id: 'a' } });
  });
});
