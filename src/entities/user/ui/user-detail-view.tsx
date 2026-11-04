'use client';

import Image from 'next/image';
import { parseAsStringLiteral, useQueryState } from 'nuqs';
import { Bell, Star, User } from 'lucide-react';

import { formatKstDate, formatKstDateTime, formatLastActive } from '@/shared/lib/utils/format-time';
import { Badge } from '@/shared/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { RoleBadge } from '@/shared/ui/role-badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';

import type { UserDetail } from '../model/types';

const TABS = ['memos', 'categories', 'calendar', 'devices'] as const;

const PROVIDER_LABEL: Record<string, string> = { GOOGLE: '구글', APPLE: '애플', KAKAO: '카카오', NAVER: '네이버' };
const THEME_LABEL: Record<string, string> = { light: '라이트', dark: '다크', system: '기기 설정 따름' };
const LANGUAGE_LABEL: Record<string, string> = { ko: '한국어', en: '영어' };
const NOTIFY_BEFORE_LABEL: Record<string, string> = {
  TEN_MINUTES_BEFORE: '10분 전',
  THIRTY_MINUTES_BEFORE: '30분 전',
  ONE_HOUR_BEFORE: '1시간 전',
  ONE_DAY_BEFORE: '1일 전',
};

function Empty({ children }: { children: React.ReactNode }) {
  return <p className="py-8 text-center text-sm text-muted-foreground">{children}</p>;
}

/**
 * 사용자 상세 — 왼쪽: 앱에서 쓴 기록(탭, URL ?tab=에 남아 링크로 공유 가능) / 오른쪽: 계정 정보
 * 작업(계정 삭제)은 페이지 머리글에
 */
export function UserDetailView({ user }: { user: UserDetail }) {
  const [tab, setTab] = useQueryState('tab', parseAsStringLiteral(TABS).withDefault('memos'));
  const memos = user.memos ?? [];
  const categories = user.categories ?? [];
  const calendarMemos = user.calendarMemos ?? [];
  const devices = user.devices ?? [];

  const account: { label: string; value: React.ReactNode }[] = [
    { label: '이메일', value: <span className="break-all">{user.email}</span> },
    {
      label: '로그인',
      value: user.providers?.length ? user.providers.map((p) => PROVIDER_LABEL[p] ?? p).join(', ') : '-',
    },
    { label: '역할', value: <RoleBadge role={user.role} /> },
    { label: '가입일', value: formatKstDate(user.createdAt) },
    { label: '최근 접속', value: user.lastActiveAt ? formatLastActive(user.lastActiveAt) : '기록 없음' },
    { label: '통계 공개', value: user.isStatsPublic ? '공개' : '비공개' },
    ...(user.settings
      ? [
          { label: '푸시 알림', value: user.settings.notification ? '받음' : '안 받음' },
          { label: '테마', value: THEME_LABEL[user.settings.theme] ?? user.settings.theme },
          { label: '언어', value: LANGUAGE_LABEL[user.settings.language] ?? user.settings.language },
        ]
      : []),
  ];

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      <Tabs
        value={tab}
        onValueChange={(value) => void setTab(value as (typeof TABS)[number])}
        className="min-w-0 gap-4"
      >
        {/* 모바일에서도 라벨이 보이게 가로 스크롤 */}
        <div className="overflow-x-auto">
          <TabsList>
            <TabsTrigger value="memos">메모 {memos.length.toLocaleString()}</TabsTrigger>
            <TabsTrigger value="categories">카테고리 {categories.length.toLocaleString()}</TabsTrigger>
            <TabsTrigger value="calendar">캘린더 {calendarMemos.length.toLocaleString()}</TabsTrigger>
            <TabsTrigger value="devices">기기 {devices.length.toLocaleString()}</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="memos">
          {memos.length === 0 ? (
            <Empty>아직 쓴 메모가 없어요.</Empty>
          ) : (
            <div className="overflow-x-auto rounded-lg border">
              <Table className="min-w-[560px]">
                <TableHeader>
                  <TableRow>
                    <TableHead>제목</TableHead>
                    <TableHead>카테고리</TableHead>
                    <TableHead className="text-right">별점</TableHead>
                    <TableHead>경험한 날</TableHead>
                    <TableHead>쓴 날</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {memos.map((memo) => (
                    <TableRow key={memo.id}>
                      <TableCell className="max-w-64 truncate font-medium">{memo.title}</TableCell>
                      <TableCell>{memo.categoryName}</TableCell>
                      <TableCell className="text-right">
                        {memo.rating != null ? (
                          <span className="inline-flex items-center gap-1 tabular-nums">
                            <Star className="size-3.5 fill-rating text-rating" aria-hidden />
                            {memo.rating}
                          </span>
                        ) : (
                          '-'
                        )}
                      </TableCell>
                      <TableCell className="tabular-nums">
                        {memo.experienceDate ? formatKstDate(memo.experienceDate) : '-'}
                      </TableCell>
                      <TableCell className="tabular-nums">{formatKstDate(memo.createdAt)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>

        <TabsContent value="categories">
          {categories.length === 0 ? (
            <Empty>카테고리가 없어요.</Empty>
          ) : (
            <ul className="divide-y rounded-lg border">
              {categories.map((category) => (
                <li key={category.id} className="flex flex-wrap items-center gap-x-3 gap-y-1 px-4 py-3">
                  <span
                    className="size-3 shrink-0 rounded-full"
                    style={{ backgroundColor: category.color }}
                    aria-hidden
                  />
                  <span className="font-medium">{category.name}</span>
                  {category.fields.length > 0 && (
                    <span className="text-sm text-muted-foreground">
                      항목: {category.fields.map((field) => field.name).join(', ')}
                    </span>
                  )}
                  <span className="ml-auto text-sm text-muted-foreground tabular-nums">
                    {formatKstDate(category.createdAt)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </TabsContent>

        <TabsContent value="calendar">
          {calendarMemos.length === 0 ? (
            <Empty>캘린더 일정이 없어요.</Empty>
          ) : (
            <div className="overflow-x-auto rounded-lg border">
              <Table className="min-w-[560px]">
                <TableHeader>
                  <TableRow>
                    <TableHead>제목</TableHead>
                    <TableHead>언제</TableHead>
                    <TableHead>알림</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {calendarMemos.map((memo) => (
                    <TableRow key={memo.id}>
                      <TableCell className="max-w-64 truncate font-medium">{memo.title}</TableCell>
                      <TableCell className="tabular-nums">
                        {memo.isAllDay
                          ? `${formatKstDate(memo.startDate)} 종일`
                          : `${formatKstDateTime(memo.startDate)} ~ ${formatKstDateTime(memo.endDate)}`}
                      </TableCell>
                      <TableCell>
                        {memo.hasNotification ? (
                          <span className="inline-flex items-center gap-1 text-sm">
                            <Bell className="size-3.5 text-muted-foreground" aria-hidden />
                            {NOTIFY_BEFORE_LABEL[memo.notifyBefore ?? ''] ?? memo.notifyBefore}
                            {memo.notificationSent && <span className="text-muted-foreground">· 보냄</span>}
                          </span>
                        ) : (
                          '-'
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>

        <TabsContent value="devices">
          {devices.length === 0 ? (
            <Empty>알림 받을 기기가 등록되지 않았어요. 이 사용자에게는 푸시 알림이 가지 않아요.</Empty>
          ) : (
            <ul className="divide-y rounded-lg border">
              {devices.map((device) => (
                <li key={device.id} className="grid gap-1 px-4 py-3 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {device.platform === 'ios'
                        ? 'iPhone'
                        : device.platform === 'android'
                          ? 'Android'
                          : device.platform}
                    </span>
                    <Badge variant={device.isActive ? 'secondary' : 'outline'}>
                      {device.isActive ? '알림 받음' : '알림 안 받음'}
                    </Badge>
                  </div>
                  <span className="text-muted-foreground tabular-nums">
                    등록 {formatKstDate(device.createdAt)} · 마지막 사용 {formatKstDateTime(device.lastActiveAt)}
                  </span>
                  <code className="truncate font-mono text-xs text-muted-foreground">{device.expoPushToken}</code>
                </li>
              ))}
            </ul>
          )}
        </TabsContent>
      </Tabs>

      <aside className="lg:sticky lg:top-6">
        <Card>
          <CardHeader className="flex flex-row items-center gap-3 space-y-0">
            {user.avatarUrl ? (
              <Image src={user.avatarUrl} alt="" width={40} height={40} className="size-10 rounded-full object-cover" />
            ) : (
              <div className="flex size-10 items-center justify-center rounded-full bg-muted">
                <User className="size-5 text-muted-foreground" aria-hidden />
              </div>
            )}
            <CardTitle>계정 정보</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-2.5 text-sm">
              {account.map((row) => (
                <div key={row.label} className="contents">
                  <dt className="text-muted-foreground">{row.label}</dt>
                  <dd className="font-medium">{row.value}</dd>
                </div>
              ))}
            </dl>
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}
