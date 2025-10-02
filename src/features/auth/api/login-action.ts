'use server';

import { redirect } from 'next/navigation';
import { loginSchema } from '../lib/types';
import { setAuthCookies } from '@/shared/lib/utils/cookie-utils';
import { login } from './api';
import { HttpError } from '@/shared/lib/utils/http-error';

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
      error: HttpError.getErrorMessage(error),
      email: rawData.email as string,
      password: rawData.password as string,
    };
  }

  redirect('/dashboard');
}
