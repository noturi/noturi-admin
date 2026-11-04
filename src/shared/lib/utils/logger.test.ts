import { describe, expect, it } from 'vitest';
import logger from './logger';

describe('logger', () => {
  // tslog v5부터 마스킹 기본값이 꺼짐 — 설정 키가 바뀌면 비밀번호가 그대로 로그에 남는다
  it('비밀번호 계열 값은 로그에 남지 않는다', () => {
    const records: unknown[] = [];
    const sub = logger.getSubLogger({
      attachedTransports: [
        (record) => {
          records.push(record);
        },
      ],
    });
    sub.error('로그인 실패', { email: 'a@n.com', password: 'secret-1', confirmPassword: 'secret-2' });

    const serialized = JSON.stringify(records);
    expect(serialized).toContain('a@n.com');
    expect(serialized).not.toContain('secret-1');
    expect(serialized).not.toContain('secret-2');
  });
});
