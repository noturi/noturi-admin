'use server';

import { redirect, unstable_rethrow } from 'next/navigation';
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

  redirect('/auth/login');
}
