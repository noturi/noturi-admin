'use server';

import { redirect } from 'next/navigation';
import { serverApi } from '@/shared/api/server-api';

export interface RegisterData {
  email: string;
  role: 'ADMIN' | 'SUPER_ADMIN';
  password: string;
  confirmPassword: string;
}

export async function registerAction(data: RegisterData) {
  try {
    console.log('📝 Attempting registration:', {
      email: data.email,
      role: data.role,
    });

    const response = await serverApi.post<{
      message: string;
      user: { id: string; email: string; role: 'ADMIN' | 'SUPER_ADMIN' };
    }>('auth/register', {
      json: {
        email: data.email,
        role: data.role,
        password: data.password,
      },
    });

    console.log('✅ Registration successful:', { user: response.user });

    redirect('/auth/login?message=registration-success');
  } catch (error) {
    console.error('❌ Registration failed:', error);

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

    throw new Error('회원가입에 실패했습니다. 다시 시도해주세요.');
  }
}
