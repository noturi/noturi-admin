// import { HttpError } from '@/shared/lib';
// import { HTTPError } from 'ky';

interface EnhancedFetchOptions extends RequestInit {
  json?: unknown;
  searchParams?: URLSearchParams | Record<string, unknown>;
  timeout?: number;
  prefixUrl?: string;
  retry?: {
    limit?: number;
    statusCodes?: number[];
  };
}

type BeforeRequestHook = (options: RequestInit) => Promise<RequestInit> | RequestInit;

interface EnhancedResponse extends Response {
  json<T = unknown>(): Promise<T>;
}

export class EnhancedFetch {
  private baseUrl: string;
  private defaultOptions: RequestInit;
  private beforeRequest?: BeforeRequestHook;

  constructor(baseUrl: string, defaultOptions: RequestInit = {}, beforeRequest?: BeforeRequestHook) {
    this.baseUrl = baseUrl;
    this.defaultOptions = defaultOptions;
    this.beforeRequest = beforeRequest;
  }

  private buildUrl(input: string, searchParams?: URLSearchParams | Record<string, unknown>): string {
    let url: string;

    if (input.startsWith('http')) {
      url = input;
    } else {
      const baseUrl = this.baseUrl || '';

      const cleanInput = input.replace(/^\//, '');
      url = baseUrl.endsWith('/') ? `${baseUrl}${cleanInput}` : `${baseUrl}/${cleanInput}`;
    }

    if (searchParams) {
      const params =
        searchParams instanceof URLSearchParams
          ? searchParams
          : new URLSearchParams(searchParams as Record<string, string>);
      url += `?${params.toString()}`;
    }

    return url;
  }

  private async enhancedFetch(input: string, options: EnhancedFetchOptions = {}): Promise<EnhancedResponse> {
    const { json, searchParams, ...fetchOptions } = options;

    const url = this.buildUrl(input, searchParams);

    let mergedOptions: RequestInit = {
      ...this.defaultOptions,
      ...fetchOptions,
    };

    if (this.beforeRequest) {
      mergedOptions = await this.beforeRequest(mergedOptions);
    }

    // JSON 처리
    if (json !== undefined) {
      mergedOptions.body = JSON.stringify(json);
      mergedOptions.headers = {
        'Content-Type': 'application/json',
        ...mergedOptions.headers,
      };
    }

    try {
      const response = await fetch(url, mergedOptions);

      if (!response.ok) {
        const error = new Error(`HTTP ${response.status}: ${response.statusText}`) as Error & {
          response: { status: number; text(): Promise<string> };
        };
        error.response = {
          status: response.status,
          text: () => response.text(),
        };
        throw error;
      }

      const enhancedResponse = response as EnhancedResponse;
      const originalJson = enhancedResponse.json.bind(enhancedResponse);

      enhancedResponse.json = async function <T = unknown>(): Promise<T> {
        if (response.status === 204) return '' as T;
        return originalJson();
      };

      return enhancedResponse;
    } catch (error) {
      throw error;
    }
  }

  async get<T = unknown>(url: string, options?: Omit<EnhancedFetchOptions, 'method'>): Promise<T> {
    const response = await this.enhancedFetch(url, { ...options, method: 'GET' });
    return response.json<T>();
  }

  async post<T = unknown>(url: string, options?: Omit<EnhancedFetchOptions, 'method'>): Promise<T> {
    const response = await this.enhancedFetch(url, { ...options, method: 'POST' });
    return response.json<T>();
  }

  async put<T = unknown>(url: string, options?: Omit<EnhancedFetchOptions, 'method'>): Promise<T> {
    const response = await this.enhancedFetch(url, { ...options, method: 'PUT' });
    return response.json<T>();
  }

  async patch<T = unknown>(url: string, options?: Omit<EnhancedFetchOptions, 'method'>): Promise<T> {
    const response = await this.enhancedFetch(url, { ...options, method: 'PATCH' });
    return response.json<T>();
  }

  async delete<T = unknown>(url: string, options?: Omit<EnhancedFetchOptions, 'method'>): Promise<T> {
    const response = await this.enhancedFetch(url, { ...options, method: 'DELETE' });
    return response.json<T>();
  }
}
