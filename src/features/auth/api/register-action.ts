'use server';

import { redirect } from 'next/navigation';
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
    console.log(validation.data);
    await register(validation.data);
  } catch (error) {
    return { error: HttpError.getErrorMessage(error) };
  }

  redirect('/auth/login');
}
