import ky, { type KyInstance } from 'ky';
import { cookies } from 'next/headers';

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL + '/admin';

export class API {
  private static instance: API;
  private clientApi: KyInstance;

  private constructor() {
    this.clientApi = ky.create({
      prefixUrl: API_BASE_URL,
      timeout: 30000,
      credentials: 'include',
      hooks: {
        afterResponse: [
          async (_, __, response) => {
            if (response.status === 401) {
              window.location.href = '/auth/login';
            }
            return response;
          },
        ],
      },
    });
  }

  static getInstance(): API {
    if (!API.instance) {
      API.instance = new API();
    }
    return API.instance;
  }

  // 클라이언트용 API
  get client() {
    return this.clientApi;
  }

  // 서버용 API (토큰 없이 - 로그인용)
  get server() {
    return ky.create({
      prefixUrl: API_BASE_URL,
      timeout: 30000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; NextJS/15.0)',
      },
    });
  }

  // 서버용 API (토큰 포함)
  async getServerWithAuth() {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;

    return ky.create({
      prefixUrl: API_BASE_URL,
      timeout: 30000,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  }
}

export const api = API.getInstance();
