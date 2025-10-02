import { serverApi } from '@/shared/api/server-api';

export interface DashboardStatistics {
  totalUsers: number;
  totalCategories: number;
  activeUsers: number;
  userGrowthRate: number;
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
  return serverApi.get<DashboardStatistics>('dashboard/statistics');
};

export const getDashboardActivities = async () => {
  return serverApi.get<DashboardActivitiesResponse>('dashboard/activities');
};
