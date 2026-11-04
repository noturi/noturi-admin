import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';
import { formatKstDate, formatKstDateTime, formatKstLong } from '@/shared/lib/utils/format-time';

import { describeNotificationDestination, describeNotificationSchedule, getNotificationStatus } from '../model/status';
import type { NotificationDetail } from '../model/types';
import { NotificationPhonePreview } from './notification-phone-preview';
import { NotificationStatusBadge } from './notification-status-badge';

/** 상태별 한 줄 안내 — "지금 이 알림이 어떻게 되는지"를 먼저 말함 */
function statusMessage(n: NotificationDetail, status: ReturnType<typeof getNotificationStatus>) {
  const people = `${n.targetUserCount.toLocaleString()}명`;
  switch (status) {
    case 'scheduled':
      return `${people}에게 ${describeNotificationSchedule(n)}에 나가요.`;
    case 'repeating':
      return `반복 일정대로 ${people}에게 나가고 있어요.`;
    case 'paused':
      return '꺼져 있어서 발송되지 않아요. 켜면 다시 일정대로 나가요.';
    case 'sent':
      return n.lastSentAt ? `${formatKstLong(n.lastSentAt)}에 보냈어요.` : '보낸 알림이에요.';
    case 'missed':
      return '예약 시각에 꺼져 있어서 발송되지 않았어요. 다시 보내려면 새 알림을 만들거나 지금 보내기를 쓰세요.';
  }
}

export function NotificationDetailView({ notification: n }: { notification: NotificationDetail }) {
  const status = getNotificationStatus(n);
  const logs = n.logs ?? [];

  const rows: { label: string; value: React.ReactNode }[] = [
    { label: '상태', value: <NotificationStatusBadge status={status} /> },
    { label: n.isRepeat ? '반복' : '예약', value: describeNotificationSchedule(n) },
    { label: '받는 사람', value: `${n.targetUserCount.toLocaleString()}명` },
    { label: '누르면', value: describeNotificationDestination(n.data) },
    ...(n.data.params && Object.keys(n.data.params).length
      ? [
          {
            label: '화면 값',
            value: <code className="font-mono text-xs break-all">{JSON.stringify(n.data.params)}</code>,
          },
        ]
      : []),
    { label: '만든 날', value: formatKstDate(n.createdAt) },
    { label: '마지막 발송', value: n.lastSentAt ? formatKstDateTime(n.lastSentAt) : '아직 없음' },
  ];

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>발송 설정</CardTitle>
            <CardDescription className={status === 'missed' ? 'text-destructive' : undefined}>
              {statusMessage(n, status)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-x-6 gap-y-3 text-sm sm:grid-cols-[8rem_minmax(0,1fr)]">
              {rows.map((row) => (
                <div key={row.label} className="contents">
                  <dt className="text-muted-foreground">{row.label}</dt>
                  <dd className="font-medium break-keep">{row.value}</dd>
                </div>
              ))}
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>발송 기록</CardTitle>
            <CardDescription>
              {logs.length ? `${logs.length.toLocaleString()}번 보냈어요.` : '아직 보낸 적이 없어요.'}
            </CardDescription>
          </CardHeader>
          {logs.length > 0 && (
            <CardContent>
              <div className="overflow-x-auto rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>보낸 시각</TableHead>
                      <TableHead className="text-right">성공</TableHead>
                      <TableHead className="text-right">실패</TableHead>
                      <TableHead className="text-right">성공률</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {logs.map((log) => {
                      const success = log.successCount ?? 0;
                      const failure = log.failureCount ?? 0;
                      const total = success + failure;
                      return (
                        <TableRow key={log.id}>
                          <TableCell className="tabular-nums">{formatKstDateTime(log.sentAt)}</TableCell>
                          <TableCell className="text-right tabular-nums">{success.toLocaleString()}</TableCell>
                          {/* 빨강은 실패가 있을 때만 */}
                          <TableCell className={`text-right tabular-nums ${failure > 0 ? 'text-destructive' : ''}`}>
                            {failure.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right tabular-nums">
                            {total > 0 ? `${Math.round((success / total) * 100)}%` : '-'}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          )}
        </Card>
      </div>

      <aside aria-label="휴대폰에 보이는 모습" className="space-y-2 lg:sticky lg:top-6">
        <p className="text-sm text-muted-foreground">휴대폰에 보이는 모습</p>
        <NotificationPhonePreview title={n.title} body={n.body} />
      </aside>
    </div>
  );
}
