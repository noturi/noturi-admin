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

export const getDashboardStatistics = async (): Promise<DashboardStatistics> => {
  const response = await serverApi.get('dashboard/statistics');
  return response.json<DashboardStatistics>();
};

export const getDashboardActivities = async (): Promise<DashboardActivitiesResponse> => {
  const response = await serverApi.get('dashboard/activities');
  return response.json<DashboardActivitiesResponse>();
};
