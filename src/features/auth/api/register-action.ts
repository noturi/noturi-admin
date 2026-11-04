'use server';

import { unstable_rethrow } from 'next/navigation';
import { registerSchema } from '../model/types';
import { register } from './api';
import { HttpError } from '@/shared/lib/utils/http-error';

export interface RegisterData {
  email: string;
  name: string;
  nickname: string;
  role: 'ADMIN' | 'SUPER_ADMIN';
  password: string;
  confirmPassword: string;
}

export async function registerAction(data: RegisterData) {
  const validation = registerSchema.safeParse(data);
  if (!validation.success) {
    return { error: '입력값을 확인해주세요.' };
  }

  try {
    await register(validation.data);
  } catch (error) {
    // 세션 만료 리다이렉트(401)는 에러 메시지로 바꾸지 않고 그대로 진행
    unstable_rethrow(error);
    return { error: HttpError.getErrorMessage(error) };
  }

  // 성공 후 이동은 화면이 정함 (대시보드 운영자 등록 → 운영자 목록, 가입 화면 → 로그인)
  // 여기서 redirect하면 운영자를 등록한 관리자까지 로그인 화면으로 보내짐
  return { success: true as const };
}
