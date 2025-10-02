import { serverApi } from '@/shared/api/server-api';
import type { AuthResponse, LoginForm } from '../lib/types';

export async function login(data: LoginForm) {
  return await serverApi.post<AuthResponse>('auth/login', { json: data });
}
