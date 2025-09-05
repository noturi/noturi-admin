export interface ErrorResponseBody {
  statusCode: number;
  code?: number;
  message: string;
  details?: unknown;
}

export class ApiError extends Error {
  statusCode: number;
  code?: number;
  details?: unknown;

  constructor(body: ErrorResponseBody) {
    super(body.message);
    this.name = 'ApiError';
    this.statusCode = body.statusCode;
    this.code = body.code;
    this.details = body.details;
  }
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface User {
  id: string;
  nickname: string;
  email: string;
  name?: string;
  avatarUrl?: string;
  provider?: string;
  isStatsPublic: boolean;
  role: 'USER' | 'ADMIN' | 'SUPER_ADMIN';
  memoCount: number;
  categoryCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface DefaultCategory {
  id: string;
  name: string;
  color: string;
  description?: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
