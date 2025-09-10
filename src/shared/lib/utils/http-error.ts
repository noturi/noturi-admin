import type { HTTPError } from 'ky';
import { notFound } from 'next/navigation';
// package
import { UserException } from '@/shared/lib/utils/user-exception';

// ----------------------------------------------------------------------

// export const parseErrorData = async (error: HTTPError) => {
//   const { message, statusCode } = await error.response.json<ResJson<null>>();

//   return { statusCode, message };
// };

// ----------------------------------------------------------------------

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

  static async backend(error: HTTPError) {
    const { status } = error.response;

    return this.errorStatus(status);
  }

  static async gateway(error: HTTPError) {
    const { status } = error.response;
    if (status === 404) return;

    return this.errorStatus(status);
  }
}
