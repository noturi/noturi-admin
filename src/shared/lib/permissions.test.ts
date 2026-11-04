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

  it('서버 권한과 같게 — ADMIN은 사용자 삭제·알림·시스템 설정 불가 (서버가 403)', () => {
    expect(can(admin).deleteUser({ id: 'u1', role: 'USER' })).toBe(false);
    expect(can(admin).viewNotification()).toBe(false);
    expect(can(admin).createNotification()).toBe(false);
    expect(can(admin).manageAppVersion()).toBe(false);
    expect(can(admin).viewAuditLog()).toBe(false);
  });

  it('SUPER_ADMIN은 사용자 삭제·알림·시스템 설정 가능', () => {
    expect(can(superAdmin).deleteUser({ id: 'u1', role: 'USER' })).toBe(true);
    expect(can(superAdmin).viewNotification()).toBe(true);
    expect(can(superAdmin).manageAppVersion()).toBe(true);
    expect(can(superAdmin).viewAuditLog()).toBe(true);
  });
});
