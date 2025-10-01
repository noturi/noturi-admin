import { redirect } from 'next/navigation';
import { DalError, DalReturn, ThrowableDalError, createSuccessReturn, createErrorReturn } from './types';
import { MESSAGES } from '../messages';

export function dalLoginRedirect<T, E extends DalError>(dalReturn: DalReturn<T, E>) {
  if (dalReturn.success) return dalReturn;
  if (dalReturn.error.type === 'no-user') return redirect('/auth/login');

  return dalReturn as DalReturn<T, Exclude<E, { type: 'no-user' }>>;
}

export function dalUnauthorizedRedirect<T, E extends DalError>(
  dalReturn: DalReturn<T, E>,
  redirectPath = '/dashboard'
) {
  if (dalReturn.success) return dalReturn;
  if (dalReturn.error.type === 'no-access') return redirect(redirectPath);

  return dalReturn as DalReturn<T, Exclude<E, { type: 'no-access' }>>;
}

export function dalNotFoundRedirect<T, E extends DalError>(dalReturn: DalReturn<T, E>) {
  if (dalReturn.success) return dalReturn;

  return dalReturn;
}

export function dalThrowError<T, E extends DalError>(dalReturn: DalReturn<T, E>) {
  if (dalReturn.success) return dalReturn;
  throw dalReturn.error;
}

export function dalVerifySuccess<T, E extends DalError>(
  dalReturn: DalReturn<T, E>,
  { unauthorizedRedirectPath }: { unauthorizedRedirectPath?: string } = {}
): T {
  const res = dalThrowError(
    dalNotFoundRedirect(dalUnauthorizedRedirect(dalLoginRedirect(dalReturn), unauthorizedRedirectPath))
  );
  return res.data;
}

export async function dalApiOperation<T>(operation: () => Promise<T>): Promise<DalReturn<T, DalError>> {
  try {
    const data = await operation();
    return createSuccessReturn(data);
  } catch (e) {
    if (e instanceof ThrowableDalError) {
      return createErrorReturn(e.dalError);
    }

    return createErrorReturn({
      type: 'unknown-error',
      error: e,
    });
  }
}

export function dalFormatErrorMessage(error: DalError): string {
  const type = error.type;

  switch (type) {
    case 'no-user':
      return '로그인이 필요합니다.';
    case 'no-access':
      return MESSAGES.COMMON.PERMISSION_DENIED;
    case 'unknown-error':
      return MESSAGES.COMMON.UNKNOWN_ERROR;
    default:
      throw new Error(`Unhandled error type: ${type as never}`);
  }
}
