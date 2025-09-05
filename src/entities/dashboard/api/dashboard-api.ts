import { getServerApiWithAuth } from '@/shared/api/api-server';

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
  const serverApi = await getServerApiWithAuth();
  return serverApi.get('dashboard/statistics').json<DashboardStatistics>();
};

export const getDashboardActivities = async (): Promise<DashboardActivitiesResponse> => {
  const serverApi = await getServerApiWithAuth();
  return serverApi.get('dashboard/activities').json<DashboardActivitiesResponse>();
};
