import { z } from 'zod';
import { PaginatedResponse } from '@/shared/api/types';

export const OperatorSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string().optional(),
  nickname: z.string().optional(),
  role: z.enum(['ADMIN', 'SUPER_ADMIN']),
  createdAt: z.string(),
  updatedAt: z.string(),
  avatarUrl: z.string().url().optional(),
  isStatsPublic: z.boolean().optional(),
});

export type Operator = z.infer<typeof OperatorSchema>;

export type OperatorListResponse = PaginatedResponse<Operator>;

export const OperatorQueryParamsSchema = z.object({
  page: z.number().min(1).optional(),
  limit: z.number().min(1).max(100).optional(),
  email: z.string().optional(),
  role: z.union([z.enum(['ADMIN', 'SUPER_ADMIN']), z.array(z.enum(['ADMIN', 'SUPER_ADMIN']))]).optional(),
  createdAt: z.string().optional(),
  sort: z.array(z.string()).optional(),
});

export type OperatorQueryParams = z.infer<typeof OperatorQueryParamsSchema>;
