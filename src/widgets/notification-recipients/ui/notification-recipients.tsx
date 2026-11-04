import Link from 'next/link';
import { unstable_rethrow } from 'next/navigation';

import { lookupUsers, type UserLookupResponse, type UserReach } from '@/entities/user';
import { ROUTES } from '@/shared/lib';
import { Badge } from '@/shared/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';

const REACH_LABEL: Record<UserReach, string | null> = {
  OK: null,
  NOTIFICATION_OFF: '알림 끔',
  NO_DEVICE: '기기 없음',
};

/** 받는 사람 명단 + 실제로 받을 수 있는 인원 — 보내기 전에 "12명 중 9명만 받음"을 알 수 있게 */
export async function NotificationRecipients({ userIds }: { userIds: string[] }) {
  let result: UserLookupResponse | null = null;
  try {
    result = await lookupUsers(userIds, true);
  } catch (error) {
    unstable_rethrow(error);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>받는 사람 {userIds.length.toLocaleString()}명</CardTitle>
        <CardDescription>
          {result ? <ReachSummaryText summary={result.summary} /> : '받는 사람 정보를 불러오지 못했어요.'}
        </CardDescription>
      </CardHeader>
      {result?.users && result.users.length > 0 && (
        <CardContent>
          <ul className="max-h-96 divide-y overflow-y-auto rounded-lg border">
            {result.users.map((user) => (
              <li key={user.id} className="flex items-center gap-3 px-4 py-2.5 text-sm">
                <Link
                  href={`${ROUTES.DASHBOARD.USER}/${user.id}`}
                  className="min-w-0 flex-1 truncate underline-offset-4 hover:underline"
                >
                  <span className="font-medium">{user.name}</span>
                  <span className="ml-2 text-muted-foreground">{user.email}</span>
                </Link>
                {REACH_LABEL[user.reach] && <Badge variant="outline">{REACH_LABEL[user.reach]}</Badge>}
              </li>
            ))}
          </ul>
        </CardContent>
      )}
    </Card>
  );
}

/** "9명이 받을 수 있어요 · 알림 끔 2명 · 기기 없음 1명" */
export function ReachSummaryText({ summary }: { summary: UserLookupResponse['summary'] }) {
  const parts = [
    summary.notificationOff > 0 && `알림 끔 ${summary.notificationOff.toLocaleString()}명`,
    summary.noDevice > 0 && `기기 없음 ${summary.noDevice.toLocaleString()}명`,
    summary.notFound > 0 && `탈퇴 ${summary.notFound.toLocaleString()}명`,
  ].filter(Boolean);
  return (
    <>
      실제로 받을 수 있는 사람{' '}
      <strong className="text-foreground tabular-nums">{summary.reachable.toLocaleString()}명</strong>
      {parts.length > 0 && <> · {parts.join(' · ')}</>}
    </>
  );
}
