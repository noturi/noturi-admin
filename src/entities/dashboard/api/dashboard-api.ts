import { http } from '#http';
import type { DashboardActivitiesResponse, DashboardStatistics } from '../model/types';

export const getDashboardStatistics = async () => {
  return http.get<DashboardStatistics>('dashboard/statistics');
};

export const getDashboardActivities = async () => {
  return http.get<DashboardActivitiesResponse>('dashboard/activities');
};
