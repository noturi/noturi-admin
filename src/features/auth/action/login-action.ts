'use server';

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { loginSchema } from '../model/schema';
import { api } from '@/shared/config/api';
import { HttpError } from '@/shared/lib/http-error';

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

  console.log('🔍 Login attempt:', { email: rawData.email, password: '***' });

  const validatedData = loginSchema.safeParse(rawData);

  if (!validatedData.success) {
    return {
      error: '이메일 또는 비밀번호가 올바르지 않습니다.',
      fieldErrors: validatedData.error.flatten().fieldErrors,
      email: rawData.email as string,
      password: rawData.password as string,
    };
  }

  try {
    console.log('🚀 Making API request to:', 'auth/login');
    console.log('📦 Request data:', validatedData.data);
    console.log('🌐 Full URL:', `${process.env.NEXT_PUBLIC_API_URL}/admin/auth/login`);

    const response = await api.server
      .post('auth/login', {
        json: validatedData.data,
      })
      .json<{
        accessToken: string;
        user: { id: string; email: string; role: 'ADMIN' | 'SUPER_ADMIN' };
      }>();

    console.log('✅ Login successful:', { user: response.user });

    const cookieStore = await cookies();
    cookieStore.set('auth-token', response.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
    });

    cookieStore.set('user-info', JSON.stringify(response.user), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
    });

    console.log('🍪 Cookies set successfully');
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
      error: HttpError.getServerActionError(error as Error),
      email: rawData.email as string,
      password: rawData.password as string,
    };
  }

  console.log('🚀 Redirecting to dashboard...');
  redirect('/dashboard');
}
