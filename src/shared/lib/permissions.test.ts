import { describe, expect, it } from 'vitest';
import { can } from './permissions';

const superAdmin = { id: 's1', email: 's@n.com', roles: ['SUPER_ADMIN' as const] };
const admin = { id: 'a1', email: 'a@n.com', roles: ['ADMIN' as const] };

describe('can', () => {
  it('SUPER_ADMIN은 다른 운영자를 수정·삭제할 수 있지만 자기 자신은 못 한다', () => {
    expect(can(superAdmin).deleteOperator({ id: 'a1' })).toBe(true);
    expect(can(superAdmin).deleteOperator({ id: 's1' })).toBe(false);
  });

  it('ADMIN은 운영자를 만들거나 지울 수 없고 자기 정보만 수정한다', () => {
    expect(can(admin).createOperator()).toBe(false);
    expect(can(admin).deleteOperator({ id: 'x' })).toBe(false);
    expect(can(admin).updateOperator({ id: 'a1' })).toBe(true);
    expect(can(admin).updateOperator({ id: 's1' })).toBe(false);
  });

  it('ADMIN은 일반 사용자(USER)만 삭제할 수 있다', () => {
    expect(can(admin).deleteUser({ id: 'u1', role: 'USER' })).toBe(true);
    expect(can(admin).deleteUser({ id: 's1', role: 'SUPER_ADMIN' })).toBe(false);
  });
});
