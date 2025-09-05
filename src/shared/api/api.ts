import ky, { type KyInstance } from 'ky';

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
}

export const api = API.getInstance();
