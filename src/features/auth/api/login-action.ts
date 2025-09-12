'use server';

import { redirect } from 'next/navigation';
import { loginSchema } from '../lib/schema';
import { serverApi } from '@/shared/api/server-api';
import { setAuthCookies } from '@/shared/lib/utils/cookie-utils';

interface LoginState {
  error?: string;
  fieldErrors?: Record<string, string[]>;
  email?: string;
  password?: string;
}

export async function loginAction(prevState: LoginState | null, formData: FormData) {
  const rawData = {
    email: formData.get('email'),
    password: formData.get('password'),
  };

  const validatedData = loginSchema.safeParse(rawData);

  console.log('validatedData', validatedData);

  try {
    const apiResponse = await serverApi.post('auth/login', {
      json: validatedData.data,
    });

    const response = await apiResponse.json<{
      accessToken: string;
      user: { id: string; email: string; role: 'ADMIN' | 'SUPER_ADMIN' };
    }>();

    console.log('✅ Login successful:', { user: response.user });

    await setAuthCookies(response.accessToken, response.user);
  } catch (error) {
    console.error('❌ Login failed:', error);

    // 에러 응답 내용 확인
    if (error && typeof error === 'object' && 'response' in error) {
      const httpError = error as { response: { text(): Promise<string> } };
      try {
        const errorText = await httpError.response.text();
        console.error('📄 Server error response:', errorText);
      } catch {
        console.error('❌ Could not read error response');
      }
    }

    return {
      error: '로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.',
      email: rawData.email as string,
      password: rawData.password as string,
    };
  }

  redirect('/dashboard');
}
