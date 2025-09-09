'use server';

import { cookies } from 'next/headers';

export async function getAuthData() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth-token')?.value;
  const userInfo = cookieStore.get('user-info')?.value;

  if (!token || !userInfo) {
    return null;
  }

  try {
    const user = JSON.parse(userInfo);
    return { token, user, isAuthenticated: true };
  } catch {
    return null;
  }
}

export async function auth() {
  const authData = await getAuthData();

  return {
    userId: authData?.user?.id || null,
    user: authData?.user || null,
    token: authData?.token || null,
    isAuthenticated: !!authData,
  };
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete('auth-token');
  cookieStore.delete('user-info');
}
