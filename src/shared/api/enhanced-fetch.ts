// import { HttpError } from '@/shared/lib';
// import { HTTPError } from 'ky';

export interface EnhancedFetchOptions extends RequestInit {
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
type ErrorHandler = (error: Error & { response?: { status: number; text(): Promise<string> } }) => Promise<void> | void;

const DEFAULT_RETRY_STATUS_CODES = [408, 429, 500, 502, 503, 504];

interface EnhancedResponse extends Response {
  json<T = unknown>(): Promise<T>;
}

export class EnhancedFetch {
  private baseUrl: string;
  private defaultOptions: RequestInit;
  private beforeRequest?: BeforeRequestHook;
  private errorHandler?: ErrorHandler;
  private defaultCacheOptions?: { revalidate?: number | false; tags?: string[] };

  constructor(
    baseUrl: string,
    defaultOptions: RequestInit = {},
    beforeRequest?: BeforeRequestHook,
    errorHandler?: ErrorHandler,
    defaultCacheOptions?: { revalidate?: number | false; tags?: string[] }
  ) {
    this.baseUrl = baseUrl;
    this.defaultOptions = defaultOptions;
    this.beforeRequest = beforeRequest;
    this.errorHandler = errorHandler;
    this.defaultCacheOptions = defaultCacheOptions;
  }

  private buildUrl(
    input: string,
    searchParams?: URLSearchParams | Record<string, unknown>,
    prefixUrl?: string
  ): string {
    let url: string;

    if (input.startsWith('http')) {
      url = input;
    } else {
      const baseUrl = prefixUrl || this.baseUrl || '';
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
    const { json, searchParams, timeout, prefixUrl, retry, ...fetchOptions } = options;

    const url = this.buildUrl(input, searchParams, prefixUrl);

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

    return this.executeWithTimeout(url, mergedOptions, retry, timeout);
  }

  private async executeWithTimeout(
    url: string,
    options: RequestInit,
    retry?: { limit?: number; statusCodes?: number[] },
    timeout?: number
  ): Promise<EnhancedResponse> {
    if (!timeout) {
      return this.executeWithRetry(url, options, retry);
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    const optionsWithSignal = { ...options, signal: controller.signal };

    try {
      return await this.executeWithRetry(url, optionsWithSignal, retry);
    } finally {
      clearTimeout(timeoutId);
    }
  }

  private async executeWithRetry(
    url: string,
    options: RequestInit,
    retryConfig?: { limit?: number; statusCodes?: number[] }
  ): Promise<EnhancedResponse> {
    const maxRetries = retryConfig?.limit ?? 0;
    const retryStatusCodes = retryConfig?.statusCodes ?? DEFAULT_RETRY_STATUS_CODES;

    let lastError: Error;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const response = await fetch(url, options);

        if (!response.ok) {
          const error = new Error(`HTTP ${response.status}: ${response.statusText}`) as Error & {
            response: { status: number; text(): Promise<string> };
          };
          error.response = {
            status: response.status,
            text: () => response.text(),
          };

          // 재시도 가능한 상태 코드인지 확인
          if (attempt < maxRetries && retryStatusCodes.includes(response.status)) {
            lastError = error;
            await this.delay(Math.pow(2, attempt) * 1000); // 지수 백오프
            continue;
          }

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
        lastError = error as Error;

        // 네트워크 에러나 타임아웃 에러도 재시도
        if (attempt < maxRetries && this.isRetryableError(error)) {
          await this.delay(Math.pow(2, attempt) * 1000);
          continue;
        }

        // 에러 핸들러 실행
        if (this.errorHandler) {
          try {
            await this.errorHandler(error as Error & { response?: { status: number; text(): Promise<string> } });
          } catch (handlerError) {
            throw handlerError;
          }
        }
        throw error;
      }
    }

    throw lastError!;
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private isRetryableError(error: unknown): boolean {
    return (
      error instanceof TypeError || // 네트워크 에러
      (error as Error).name === 'AbortError' // 타임아웃
    );
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
