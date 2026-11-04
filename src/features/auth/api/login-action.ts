'use server';

import { redirect } from 'next/navigation';
import { loginSchema } from '../model/types';
import { setAuthCookies } from '@/shared/lib/utils/cookie-utils';
import { login } from './api';
import { HttpError } from '@/shared/lib/utils/http-error';

/** 실패 시 이메일만 돌려줌 — 비밀번호를 응답에 담아 다시 채우지 않음 */
interface LoginState {
  error?: string;
  email?: string;
}

export async function loginAction(_prevState: LoginState | null, formData: FormData) {
  const rawData = {
    email: formData.get('email'),
    password: formData.get('password'),
  };

  const validation = loginSchema.safeParse(rawData);
  if (!validation.success) {
    return {
      error: '이메일과 비밀번호를 확인해 주세요.',
      email: String(rawData.email ?? ''),
    };
  }

  try {
    const response = await login(validation.data);
    await setAuthCookies(response.accessToken, response.user);
  } catch (error) {
    return {
      error: HttpError.getErrorMessage(error),
      email: String(rawData.email ?? ''),
    };
  }

  redirect('/dashboard');
}
