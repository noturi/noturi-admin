import Link from 'next/link';
import { unstable_rethrow } from 'next/navigation';
import { Activity, CalendarCheck, FileText, Users } from 'lucide-react';

import { getDashboardActivities, getDashboardStatistics } from '@/entities/dashboard';
import {
  describeNotificationSchedule,
  getNotificationList,
  getNotificationStatus,
  NotificationStatusBadge,
  type Notification,
} from '@/entities/notification';
import { formatKstDateTime, formatKstLong, ROUTES } from '@/shared/lib';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { PageHeader } from '@/shared/ui/heading';
import PageContainer from '@/shared/ui/page-container';

export const metadata = { title: '대시보드 | Noturi Admin' };

/** 서버가 주는 활동 제목은 '투두' 표기 — 앱 용어('할 일')로 */
const ACTIVITY_LABEL: Record<string, string> = {
  USER_REGISTRATION: '새 사용자 가입',
  MEMO_CREATION: '메모 작성',
  MEMO_UPDATE: '메모 수정',
  TODO_CREATION: '할 일 추가',
  TODO_UPDATE: '할 일 수정',
};

/** 오늘 날짜(KST) — 요청마다 서버에서 렌더 */
const todayLabel = () => formatKstLong(Date.now(), { withTime: false });

/** 켜진 알림 중 앞으로 나갈 것 + 발송 못 한 것 — 대시보드에서 바로 확인 */
async function getAttentionNotifications(): Promise<Notification[]> {
  try {
    const { data } = await getNotificationList({ page: 1, limit: 50 });
    return (data ?? [])
      .filter((n) => ['scheduled', 'repeating', 'missed'].includes(getNotificationStatus(n)))
      .slice(0, 5);
  } catch (error) {
    // 세션 만료는 그대로 진행, 그 밖의 실패는 카드만 비움 (대시보드 전체를 막지 않음)
    unstable_rethrow(error);
    return [];
  }
}

export default async function DashboardPage() {
  const [statistics, { activities }, notifications] = await Promise.all([
    getDashboardStatistics(),
    getDashboardActivities(),
    getAttentionNotifications(),
  ]);

  const growth = statistics.userGrowthRate;
  const stats = [
    {
      title: '전체 사용자',
      value: statistics.totalUsers,
      // 서버 값은 "이번 달 신규 가입 수"의 지난달 대비 증가율 (전체 사용자 증가율이 아님)
      description: `이번 달 신규 가입 지난달 대비 ${growth > 0 ? '+' : ''}${growth}%`,
      icon: Users,
    },
    {
      title: '활성 사용자',
      value: statistics.activeUsers,
      description: '최근 30일 안에 앱을 연 사용자',
      icon: Activity,
    },
    { title: '메모 쓴 사용자', value: statistics.weeklyMemoUsers, description: '이번 주(일요일부터)', icon: FileText },
    {
      title: '할 일 쓴 사용자',
      value: statistics.weeklyTodoUsers,
      description: '이번 주(일요일부터)',
      icon: CalendarCheck,
    },
  ];

  return (
    <PageContainer>
      <PageHeader title="대시보드" description={`${todayLabel()} 기준 서비스 현황`} />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="size-4 text-muted-foreground" aria-hidden />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold tabular-nums">{stat.value.toLocaleString()}명</p>
              <p className="text-xs break-keep text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
            <div className="space-y-1.5">
              <CardTitle>나갈 알림</CardTitle>
              <CardDescription>켜져 있는 예약·반복 알림과 발송되지 못한 알림</CardDescription>
            </div>
            <Link href={ROUTES.DASHBOARD.NOTIFICATION} className="shrink-0 text-sm underline-offset-4 hover:underline">
              전체 보기
            </Link>
          </CardHeader>
          <CardContent>
            {notifications.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">예정된 알림이 없어요.</p>
            ) : (
              <ul className="divide-y">
                {notifications.map((n) => (
                  <li key={n.id}>
                    <Link
                      href={`${ROUTES.DASHBOARD.NOTIFICATION}/${n.id}`}
                      className="-mx-2 flex items-center gap-3 rounded-md px-2 py-3 hover:bg-accent"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{n.title}</p>
                        <p className="truncate text-xs text-muted-foreground tabular-nums">
                          {describeNotificationSchedule(n)} · {n.targetUserCount.toLocaleString()}명
                        </p>
                      </div>
                      <NotificationStatusBadge status={getNotificationStatus(n)} />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>최근 활동</CardTitle>
            <CardDescription>가입·메모·할 일 기록</CardDescription>
          </CardHeader>
          <CardContent>
            {activities.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">최근 활동이 없어요.</p>
            ) : (
              <ul className="divide-y">
                {activities.map((activity) => (
                  <li
                    key={`${activity.type}-${activity.createdAt}-${activity.description}`}
                    className="flex items-baseline gap-3 py-3"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">{ACTIVITY_LABEL[activity.type] ?? activity.title}</p>
                      <p className="truncate text-sm text-muted-foreground">{activity.description}</p>
                    </div>
                    <time dateTime={activity.createdAt} className="shrink-0 text-xs text-muted-foreground tabular-nums">
                      {formatKstDateTime(activity.createdAt)}
                    </time>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
