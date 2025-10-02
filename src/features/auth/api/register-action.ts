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
    throw new Error('회원가입에 실패했습니다. 다시 시도해주세요.');
  }
}
