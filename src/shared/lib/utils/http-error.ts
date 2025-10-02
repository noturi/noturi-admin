import { notFound } from 'next/navigation';
import { UserException } from '@/shared/lib/utils/user-exception';

// EnhancedFetch 에러 타입
interface EnhancedFetchError extends Error {
  response?: {
    status: number;
    text(): Promise<string>;
  };
}

export class HttpError {
  private static errorStatus(status: number) {
    switch (status) {
      case 401:
        throw new UserException('AuthError', { name: status.toString(), cause: 'Unauthorized' });
      case 403:
        throw new UserException('ForbiddenError', { name: status.toString(), cause: 'Forbidden' });
      case 404:
        return notFound();
      case 500:
        throw new UserException('ServerError', { name: status.toString(), cause: 'Internal Server Error' });
      case 502:
        throw new UserException('NginxError', { name: status.toString(), cause: 'Bad Gateway' });
      case 503:
        throw new UserException('NginxError', { name: status.toString(), cause: 'Service Unavailable' });
      default:
        return;
    }
  }

  static async backend(error: EnhancedFetchError) {
    const status = error.response?.status;
    if (!status) return;

    return this.errorStatus(status);
  }

  static async gateway(error: EnhancedFetchError) {
    const status = error.response?.status;
    if (!status || status === 404) return;

    return this.errorStatus(status);
  }

  static getStatusCode(error: unknown): number | null {
    if (error && typeof error === 'object' && 'response' in error) {
      const enhancedError = error as EnhancedFetchError;
      return enhancedError.response?.status ?? null;
    }
    return null;
  }

  static getErrorMessage(error: unknown): string {
    const status = this.getStatusCode(error);

    switch (status) {
      case 400:
        return '잘못된 요청입니다. 입력값을 확인해주세요.';
      case 401:
        return '이메일 또는 비밀번호가 올바르지 않습니다.';
      case 403:
        return '접근 권한이 없습니다.';
      case 404:
        return '요청하신 정보를 찾을 수 없습니다.';
      case 409:
        return '이미 존재하는 데이터입니다.';
      case 422:
        return '입력값에 오류가 있습니다.';
      case 429:
        return '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.';
      case 500:
        return '서버에 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
      case 502:
        return '서버 연결에 문제가 있습니다.';
      case 503:
        return '서비스를 일시적으로 사용할 수 없습니다.';
      default:
        return '문제가 발생했습니다. 네트워크를 확인해주세요.';
    }
  }

  static isAuthError(error: unknown): boolean {
    return this.getStatusCode(error) === 401;
  }

  static isForbiddenError(error: unknown): boolean {
    return this.getStatusCode(error) === 403;
  }
}
