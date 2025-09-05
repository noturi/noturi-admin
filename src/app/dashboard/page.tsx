'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, FolderOpen, Activity, TrendingUp } from 'lucide-react';

const stats = [
  {
    title: '총 사용자',
    value: '1,234',
    description: '전월 대비 +12%',
    icon: Users,
  },
  {
    title: '총 카테고리',
    value: '56',
    description: '활성 카테고리',
    icon: FolderOpen,
  },
  {
    title: '활성 사용자',
    value: '890',
    description: '이번 달',
    icon: Activity,
  },
  {
    title: '성장률',
    value: '12.5%',
    description: '지난 달 대비',
    icon: TrendingUp,
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">대시보드</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>최근 활동</CardTitle>
            <CardDescription>시스템의 최근 활동 내역입니다.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              <div className="flex items-center">
                <div className="space-y-1">
                  <p className="text-sm leading-none font-medium">새로운 사용자 등록</p>
                  <p className="text-muted-foreground text-sm">user@example.com</p>
                </div>
                <div className="ml-auto font-medium">방금 전</div>
              </div>
              <div className="flex items-center">
                <div className="space-y-1">
                  <p className="text-sm leading-none font-medium">카테고리 생성</p>
                  <p className="text-muted-foreground text-sm">새로운 카테고리가 추가되었습니다</p>
                </div>
                <div className="ml-auto font-medium">5분 전</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>최근 통계</CardTitle>
            <CardDescription>주요 지표의 변화를 확인하세요.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="space-y-1">
                  <p className="text-sm leading-none font-medium">신규 가입자</p>
                  <p className="text-muted-foreground text-sm">이번 주</p>
                </div>
                <div className="ml-auto font-medium text-green-600">+23</div>
              </div>
              <div className="flex items-center">
                <div className="space-y-1">
                  <p className="text-sm leading-none font-medium">활성 사용자</p>
                  <p className="text-muted-foreground text-sm">오늘</p>
                </div>
                <div className="ml-auto font-medium">156</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
