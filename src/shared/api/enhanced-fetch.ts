import { HttpError } from '@/shared/lib';

interface EnhancedFetchOptions extends RequestInit {
  json?: unknown;
  searchParams?: URLSearchParams | Record<string, string>;
  timeout?: number;
  prefixUrl?: string;
  retry?: {
    limit?: number;
    statusCodes?: number[];
  };
}

interface EnhancedResponse extends Response {
  json<T = unknown>(): Promise<T>;
}

export class EnhancedFetch {
  private baseUrl: string;
  private defaultOptions: RequestInit;

  constructor(baseUrl: string, defaultOptions: RequestInit = {}) {
    this.baseUrl = baseUrl;
    this.defaultOptions = defaultOptions;
  }

  private buildUrl(input: string, searchParams?: URLSearchParams | Record<string, string>): string {
    let url = input.startsWith('http') ? input : `${this.baseUrl}/${input.replace(/^\//, '')}`;

    if (searchParams) {
      const params = searchParams instanceof URLSearchParams ? searchParams : new URLSearchParams(searchParams);
      url += `?${params.toString()}`;
    }

    return url;
  }

  private async enhancedFetch(input: string, options: EnhancedFetchOptions = {}): Promise<EnhancedResponse> {
    const { json, searchParams, ...fetchOptions } = options;

    const url = this.buildUrl(input, searchParams);

    const mergedOptions: RequestInit = {
      ...this.defaultOptions,
      ...fetchOptions,
    };

    // JSON 처리
    if (json !== undefined) {
      mergedOptions.body = JSON.stringify(json);
      mergedOptions.headers = {
        'Content-Type': 'application/json',
        ...mergedOptions.headers,
      };
    }

    try {
      // Next.js fetch 사용 (모든 캐싱 옵션 포함)
      const response = await fetch(url, mergedOptions);

      // 에러 처리
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      // Response 확장
      const enhancedResponse = response as EnhancedResponse;
      const originalJson = enhancedResponse.json.bind(enhancedResponse);

      enhancedResponse.json = async function <T = unknown>(): Promise<T> {
        if (response.status === 204) return '' as T;
        return originalJson();
      };

      return enhancedResponse;
    } catch (error) {
      // HttpError 처리
      if (error instanceof Error) {
        HttpError.backend(error as Error);
      }
      throw error;
    }
  }

  async get(url: string, options?: Omit<EnhancedFetchOptions, 'method'>) {
    return this.enhancedFetch(url, { ...options, method: 'GET' });
  }

  async post(url: string, options?: Omit<EnhancedFetchOptions, 'method'>) {
    return this.enhancedFetch(url, { ...options, method: 'POST' });
  }

  async put(url: string, options?: Omit<EnhancedFetchOptions, 'method'>) {
    return this.enhancedFetch(url, { ...options, method: 'PUT' });
  }

  async patch(url: string, options?: Omit<EnhancedFetchOptions, 'method'>) {
    return this.enhancedFetch(url, { ...options, method: 'PATCH' });
  }

  async delete(url: string, options?: Omit<EnhancedFetchOptions, 'method'>) {
    return this.enhancedFetch(url, { ...options, method: 'DELETE' });
  }
}
