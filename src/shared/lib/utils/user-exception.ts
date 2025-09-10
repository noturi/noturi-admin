export interface UserExceptionOptions {
  name: string;
  cause?: string;
  details?: unknown;
}

export class UserException extends Error {
  public readonly name: string;
  public readonly cause?: string;
  public readonly details?: unknown;

  constructor(message: string, options?: UserExceptionOptions) {
    super(message);

    this.name = options?.name || 'UserException';
    this.cause = options?.cause;
    this.details = options?.details;

    // Error 스택 트레이스를 올바르게 설정
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, UserException);
    }
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      cause: this.cause,
      details: this.details,
    };
  }
}
