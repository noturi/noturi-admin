import { z } from 'zod';

export const userRoleSchema = z.enum(['ADMIN', 'SUPER_ADMIN', 'USER']);

export type UserRole = z.infer<typeof userRoleSchema>;

export const authUserSchema = z.object({
  id: z.string(),
  email: z.string(),
  roles: z.array(userRoleSchema),
  name: z.string().optional(),
  nickname: z.string().optional(),
  avatarUrl: z.string().optional(),
  isStatsPublic: z.boolean().optional(),
});

export type AuthUser = z.infer<typeof authUserSchema>;
