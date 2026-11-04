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
        return '입력한 내용을 다시 확인해 주세요.';
      case 401:
        return '이메일 또는 비밀번호가 맞지 않아요.';
      case 403:
        return '이 작업을 할 권한이 없어요.';
      case 404:
        return '찾는 정보가 없어요. 이미 삭제됐을 수 있어요.';
      case 409:
        return '이미 같은 항목이 있어요. 이메일·이름이 겹치는지 확인해 주세요.';
      case 422:
        return '입력한 내용을 다시 확인해 주세요.';
      case 429:
        return '요청이 너무 많아요. 잠시 후 다시 시도해 주세요.';
      case 500:
        return '서버에 문제가 생겼어요. 잠시 후 다시 시도해 주세요.';
      case 502:
        return '서버에 연결하지 못했어요. 잠시 후 다시 시도해 주세요.';
      case 503:
        return '서비스를 잠시 쓸 수 없어요. 잠시 후 다시 시도해 주세요.';
      default:
        return '처리하지 못했어요. 네트워크 연결을 확인해 주세요.';
    }
  }

  static isAuthError(error: unknown): boolean {
    return this.getStatusCode(error) === 401;
  }

  static isForbiddenError(error: unknown): boolean {
    return this.getStatusCode(error) === 403;
  }
}
