import { publicApi, serverApi } from '@/shared/api/server-api';
import type { AuthResponse, LoginForm, RegisterForm } from '../model/types';

export async function login(data: LoginForm) {
  return await publicApi.post<AuthResponse>('auth/login', { json: data });
}

// 운영자 등록은 SUPER_ADMIN 토큰이 필요 (서버 JwtAuthGuard + AdminGuard)
export async function register(data: RegisterForm) {
  return await serverApi.post<{
    message: string;
    user: { id: string; email: string; role: 'ADMIN' | 'SUPER_ADMIN' };
  }>('auth/register', { json: data });
}
