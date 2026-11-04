import { http } from '#http';

export interface DashboardStatistics {
  totalUsers: number;
  activeUsers: number;
  userGrowthRate: number;
  weeklyMemoUsers: number;
  weeklyTodoUsers: number;
}

export interface DashboardActivity {
  type: string;
  title: string;
  description: string;
  createdAt: string;
}

export interface DashboardActivitiesResponse {
  activities: DashboardActivity[];
}

export const getDashboardStatistics = async () => {
  return http.get<DashboardStatistics>('dashboard/statistics');
};

export const getDashboardActivities = async () => {
  return http.get<DashboardActivitiesResponse>('dashboard/activities');
};
