export interface Operator {
  id: string;
  email: string;
  name?: string;
  nickname?: string;
  role: 'ADMIN' | 'SUPER_ADMIN';
  createdAt: string;
  updatedAt: string;
  avatarUrl?: string;
  isStatsPublic?: boolean;
}

export interface OperatorQueryParams {
  page?: number;
  limit?: number;
  email?: string;
  role?: 'ADMIN' | 'SUPER_ADMIN' | ('ADMIN' | 'SUPER_ADMIN')[];
  createdAt?: string;
  sort?: string[];
}
