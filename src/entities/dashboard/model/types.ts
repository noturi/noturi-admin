import { z } from 'zod';

export const DashboardStatisticsSchema = z.object({
  totalUsers: z.number(),
  activeUsers: z.number(),
  userGrowthRate: z.number(),
  weeklyMemoUsers: z.number(),
  weeklyTodoUsers: z.number(),
});

export type DashboardStatistics = z.infer<typeof DashboardStatisticsSchema>;

export const DashboardActivitySchema = z.object({
  type: z.string(),
  title: z.string(),
  description: z.string(),
  createdAt: z.string(),
});

export type DashboardActivity = z.infer<typeof DashboardActivitySchema>;

export const DashboardActivitiesResponseSchema = z.object({
  activities: z.array(DashboardActivitySchema),
});

export type DashboardActivitiesResponse = z.infer<typeof DashboardActivitiesResponseSchema>;
