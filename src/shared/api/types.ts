import { z } from 'zod';

export type PaginatedResponse<T> = {
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

// Generic API Error (Zod Schema)
export const ApiErrorSchema = z.object({
  statusCode: z.number(),
  code: z.number(),
  message: z.string(),
  details: z.record(z.string(), z.any()).optional(),
});

// Generic API Error (Type)
export type ApiError = z.infer<typeof ApiErrorSchema>;
