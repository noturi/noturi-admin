'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Badge } from '@/shared/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';
import { ScrollArea } from '@/shared/ui/scroll-area';
import type { NotificationDetail } from '../model/types';
import { REPEAT_DAYS_MAP } from '../model/types';
import { Bell, Calendar, Clock, Users, Repeat, Send, CheckCircle2, XCircle, Info } from 'lucide-react';

interface NotificationDetailViewProps {
  notification: NotificationDetail;
}

export function NotificationDetailView({ notification }: NotificationDetailViewProps) {
  return (
    <div className="space-y-6">
      {/* Notification Info Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-full">
              <Bell className="text-primary h-6 w-6" />
            </div>
            <div className="flex-1">
              <CardTitle className="flex items-center gap-2 text-xl">
                {notification.title}
                <Badge variant={notification.isActive ? 'default' : 'secondary'}>
                  {notification.isActive ? '활성' : '비활성'}
                </Badge>
                {notification.isRepeat && (
                  <Badge variant="outline">
                    <Repeat className="mr-1 h-3 w-3" />
                    반복
                  </Badge>
                )}
              </CardTitle>
              <CardDescription className="mt-1">{notification.body}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="flex items-center gap-2">
              <Users className="text-muted-foreground h-4 w-4" />
              <span className="text-sm">대상: {notification.targetUserCount.toLocaleString()}명</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="text-muted-foreground h-4 w-4" />
              <span className="text-sm">생성: {new Date(notification.createdAt).toLocaleDateString('ko-KR')}</span>
            </div>
            {notification.scheduledAt && (
              <div className="flex items-center gap-2">
                <Clock className="text-muted-foreground h-4 w-4" />
                <span className="text-sm">예약: {new Date(notification.scheduledAt).toLocaleString('ko-KR')}</span>
              </div>
            )}
            {notification.lastSentAt && (
              <div className="flex items-center gap-2">
                <Send className="text-muted-foreground h-4 w-4" />
                <span className="text-sm">
                  마지막 발송: {new Date(notification.lastSentAt).toLocaleString('ko-KR')}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="info" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="info" className="flex items-center gap-1">
            <Info className="h-4 w-4" />
            상세 정보
          </TabsTrigger>
          <TabsTrigger value="logs" className="flex items-center gap-1">
            <Send className="h-4 w-4" />
            발송 로그 ({notification.logs?.length || 0})
          </TabsTrigger>
        </TabsList>

        {/* Info Tab */}
        <TabsContent value="info">
          <Card>
            <CardHeader>
              <CardTitle>알림 설정</CardTitle>
              <CardDescription>알림 발송 설정 정보</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* 발송 타입 */}
                <div className="rounded-lg border p-4">
                  <p className="text-muted-foreground text-sm">발송 타입</p>
                  <p className="mt-1 font-medium">
                    {!notification.scheduledAt && !notification.scheduledTime
                      ? '즉시 발송'
                      : notification.isRepeat
                        ? '반복 발송'
                        : '예약 발송'}
                  </p>
                </div>

                {/* 예약 시간 */}
                {notification.scheduledTime && (
                  <div className="rounded-lg border p-4">
                    <p className="text-muted-foreground text-sm">발송 시간</p>
                    <p className="mt-1 font-medium">{notification.scheduledTime}</p>
                  </div>
                )}

                {/* 반복 요일 */}
                {notification.isRepeat && notification.repeatDays && (
                  <div className="rounded-lg border p-4">
                    <p className="text-muted-foreground text-sm">반복 요일</p>
                    <div className="mt-2 flex gap-1">
                      {[0, 1, 2, 3, 4, 5, 6].map((day) => (
                        <Badge key={day} variant={notification.repeatDays?.includes(day) ? 'default' : 'outline'}>
                          {REPEAT_DAYS_MAP[day]}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* 반복 종료일 */}
                {notification.repeatEndAt && (
                  <div className="rounded-lg border p-4">
                    <p className="text-muted-foreground text-sm">반복 종료일</p>
                    <p className="mt-1 font-medium">{new Date(notification.repeatEndAt).toLocaleDateString('ko-KR')}</p>
                  </div>
                )}

                {/* 딥링크 설정 */}
                <div className="rounded-lg border p-4 md:col-span-2">
                  <p className="text-muted-foreground text-sm">딥링크</p>
                  <p className="mt-1 font-mono text-sm">screen: {notification.data.screen}</p>
                  {notification.data.params && (
                    <p className="text-muted-foreground mt-1 font-mono text-sm">
                      params: {JSON.stringify(notification.data.params)}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Logs Tab */}
        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle>발송 로그</CardTitle>
              <CardDescription>알림 발송 히스토리</CardDescription>
            </CardHeader>
            <CardContent>
              {notification.logs && notification.logs.length > 0 ? (
                <ScrollArea className="h-[400px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>발송 시간</TableHead>
                        <TableHead>성공</TableHead>
                        <TableHead>실패</TableHead>
                        <TableHead>성공률</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {notification.logs.map((log) => {
                        const successCount = log.successCount ?? 0;
                        const failureCount = log.failureCount ?? 0;
                        const total = successCount + failureCount;
                        const successRate = total > 0 ? Math.round((successCount / total) * 100) : 0;

                        return (
                          <TableRow key={log.id}>
                            <TableCell>{new Date(log.sentAt).toLocaleString('ko-KR')}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1 text-green-600">
                                <CheckCircle2 className="h-4 w-4" />
                                {successCount.toLocaleString()}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1 text-red-600">
                                <XCircle className="h-4 w-4" />
                                {failureCount.toLocaleString()}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant={successRate >= 90 ? 'default' : 'destructive'}>{successRate}%</Badge>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </ScrollArea>
              ) : (
                <p className="text-muted-foreground">발송 로그가 없습니다.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
