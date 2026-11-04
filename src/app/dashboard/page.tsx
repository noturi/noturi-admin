import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Heading } from '@/shared/ui/heading';
import PageContainer from '@/shared/ui/page-container';
import { Separator } from '@/shared/ui/separator';
import { Users, FileText, Activity, CalendarCheck } from 'lucide-react';
import { getDashboardStatistics, getDashboardActivities } from '@/entities/dashboard';

export default async function DashboardPage() {
  const [statistics, activities] = await Promise.all([getDashboardStatistics(), getDashboardActivities()]);

  const stats = [
    {
      title: '총 사용자',
      value: statistics.totalUsers.toLocaleString(),
      // 감소하면 '+-1.5%'로 보이던 문제 — 부호를 값에 맞춰 붙임
      description: `전월 대비 ${statistics.userGrowthRate > 0 ? '+' : ''}${statistics.userGrowthRate}%`,
      icon: Users,
    },
    {
      title: '활성 사용자',
      value: statistics.activeUsers.toLocaleString(),
      description: '이번 달',
      icon: Activity,
    },
    {
      title: '주간 메모 사용자',
      value: statistics.weeklyMemoUsers.toLocaleString(),
      description: '이번 주 메모 작성',
      icon: FileText,
    },
    {
      title: '주간 투두 사용자',
      value: statistics.weeklyTodoUsers.toLocaleString(),
      description: '이번 주 투두 작성',
      icon: CalendarCheck,
    },
  ];
  return (
    <PageContainer>
      <div className="flex flex-1 flex-col space-y-4">
        <Heading title="대시보드" description="서비스 현황과 최근 활동" />
        <Separator />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold tabular-nums">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
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
                {activities.activities.map((activity) => (
                  <div key={`${activity.type}-${activity.createdAt}-${activity.title}`} className="flex items-center">
                    <div className="space-y-1">
                      <p className="text-sm leading-none font-medium">{activity.title}</p>
                      <p className="text-sm text-muted-foreground">{activity.description}</p>
                    </div>
                    <div className="ml-auto font-medium">
                      {new Date(activity.createdAt).toLocaleString('ko-KR', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false,
                        timeZone: 'Asia/Seoul',
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
