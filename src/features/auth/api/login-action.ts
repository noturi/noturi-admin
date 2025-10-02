'use server';

import { redirect } from 'next/navigation';
import { loginSchema } from '../lib/types';
import { setAuthCookies } from '@/shared/lib/utils/cookie-utils';
import { login } from './api';

interface LoginState {
  error?: string;
  email?: string;
  password?: string;
}

export async function loginAction(_prevState: LoginState | null, formData: FormData) {
  const rawData = {
    email: formData.get('email'),
    password: formData.get('password'),
  };

  const validation = loginSchema.safeParse(rawData);
  if (!validation.success) {
    return {
      error: '입력값을 확인해주세요.',
      email: rawData.email as string,
      password: rawData.password as string,
    };
  }

  try {
    const response = await login(validation.data);
    await setAuthCookies(response.accessToken, response.user);
  } catch (error) {
    return {
      error: '이메일 또는 비밀번호가 올바르지 않습니다.',
      email: rawData.email as string,
      password: rawData.password as string,
    };
  }

  redirect('/dashboard');
}
