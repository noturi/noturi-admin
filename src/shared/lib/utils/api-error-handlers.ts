import { redirect } from 'next/navigation';
import { HttpError } from './http-error';

export async function withLoginRedirect<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (HttpError.isAuthError(error)) {
      redirect('/auth/login');
    }
    throw error;
  }
}

export async function withUnauthorizedRedirect<T>(fn: () => Promise<T>, redirectPath = '/dashboard'): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (HttpError.isForbiddenError(error)) {
      redirect(redirectPath);
    }
    throw error;
  }
}

export async function withErrorHandling<T>(
  fn: () => Promise<T>,
  options?: { unauthorizedRedirectPath?: string }
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (HttpError.isAuthError(error)) {
      redirect('/auth/login');
    }
    if (HttpError.isForbiddenError(error)) {
      redirect(options?.unauthorizedRedirectPath || '/dashboard');
    }
    throw error;
  }
}
