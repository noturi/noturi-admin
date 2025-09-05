import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Users, FolderOpen, Activity } from 'lucide-react';
import { getDashboardStatistics, getDashboardActivities } from '@/entities/dashboard';

export default async function DashboardPage() {
  const [statistics, activities] = await Promise.all([getDashboardStatistics(), getDashboardActivities()]);

  const stats = [
    {
      title: '총 사용자',
      value: statistics.totalUsers.toLocaleString(),
      description: `전월 대비 +${statistics.userGrowthRate}%`,
      icon: Users,
    },
    {
      title: '총 카테고리',
      value: statistics.totalCategories.toLocaleString(),
      description: '활성 카테고리',
      icon: FolderOpen,
    },
    {
      title: '활성 사용자',
      value: statistics.activeUsers.toLocaleString(),
      description: '이번 달',
      icon: Activity,
    },
  ];
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">대시보드</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-muted-foreground text-xs">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>최근 활동</CardTitle>
            <CardDescription>시스템의 최근 활동 내역입니다.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {activities.activities.map((activity, index) => (
                <div key={index} className="flex items-center">
                  <div className="space-y-1">
                    <p className="text-sm leading-none font-medium">{activity.title}</p>
                    <p className="text-muted-foreground text-sm">{activity.description}</p>
                  </div>
                  <div className="ml-auto font-medium">
                    {new Date(activity.createdAt).toLocaleString('ko-KR', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
