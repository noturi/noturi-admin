import { serverApi } from '@/shared/api/server-api';
import type { AuthResponse, LoginForm, RegisterForm } from '../model/types';

export async function login(data: LoginForm) {
  return await serverApi.post<AuthResponse>('auth/login', { json: data });
}

export async function register(data: RegisterForm) {
  return await serverApi.post<{
    message: string;
    user: { id: string; email: string; role: 'ADMIN' | 'SUPER_ADMIN' };
  }>('auth/register', { json: data });
}
