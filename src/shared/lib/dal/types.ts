export type DalError =
  | {
      type: 'no-user';
    }
  | {
      type: 'no-access';
    }
  | {
      type: 'unknown-error';
      error: unknown;
    };

export type DalReturn<T, E extends DalError = DalError> = { success: true; data: T } | { success: false; error: E };

export class ThrowableDalError extends Error {
  constructor(public dalError: DalError) {
    super(`DAL Error: ${dalError.type}`);
  }
}

export function createSuccessReturn<T>(data: T): DalReturn<T, never> {
  return { success: true, data };
}

export function createErrorReturn<E extends DalError>(error: E): DalReturn<never, E> {
  return { success: false, error };
}
