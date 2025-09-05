import type { HTTPError } from 'ky';

export class HttpError {
  private static getErrorMessage(status: number): string {
    switch (status) {
      case 400:
      case 401:
        return '이메일 또는 비밀번호가 올바르지 않습니다.';
      case 403:
        return '접근 권한이 없습니다.';
      case 404:
        return '요청한 리소스를 찾을 수 없습니다.';
      case 500:
        return '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
      case 502:
      case 503:
        return '서버에 일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요.';
      default:
        return '알 수 없는 오류가 발생했습니다.';
    }
  }

  // Server Actions용 - 에러 메시지만 반환
  static getServerActionError(error: HTTPError | Error): string {
    if (error instanceof Error && 'response' in error) {
      const httpError = error as HTTPError;
      return this.getErrorMessage(httpError.response.status);
    }

    return '로그인에 실패했습니다.';
  }

  // 기존 메소드들은 그대로 유지
  static async backend(error: HTTPError) {
    const { status } = error.response;
    return this.getErrorMessage(status);
  }
}
