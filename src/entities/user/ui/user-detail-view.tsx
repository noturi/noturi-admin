'use client';

import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Badge } from '@/shared/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { Separator } from '@/shared/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';
import { ScrollArea } from '@/shared/ui/scroll-area';
import type { UserDetail } from '../model/types';
import {
  User,
  Mail,
  Calendar,
  Settings,
  Smartphone,
  FolderOpen,
  FileText,
  Bell,
  Star,
  Globe,
  Palette,
} from 'lucide-react';

interface UserDetailViewProps {
  user: UserDetail;
}

export function UserDetailView({ user }: UserDetailViewProps) {
  return (
    <div className="space-y-6">
      {/* User Profile Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            {user.avatarUrl ? (
              <Image
                src={user.avatarUrl}
                alt={user.name}
                width={64}
                height={64}
                className="h-16 w-16 rounded-full object-cover"
              />
            ) : (
              <div className="bg-muted flex h-16 w-16 items-center justify-center rounded-full">
                <User className="text-muted-foreground h-8 w-8" />
              </div>
            )}
            <div className="flex-1">
              <CardTitle className="flex items-center gap-2 text-xl">
                {user.name}
                <Badge variant={user.role === 'ADMIN' ? 'default' : 'secondary'}>{user.role}</Badge>
              </CardTitle>
              <CardDescription className="mt-1">@{user.nickname}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="flex items-center gap-2">
              <Mail className="text-muted-foreground h-4 w-4" />
              <span className="text-sm">{user.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="text-muted-foreground h-4 w-4" />
              <span className="text-sm">가입일: {new Date(user.createdAt).toLocaleDateString('ko-KR')}</span>
            </div>
            {user.providers && user.providers.length > 0 && (
              <div className="flex items-center gap-2">
                <Globe className="text-muted-foreground h-4 w-4" />
                <div className="flex gap-1">
                  {user.providers.map((provider) => (
                    <Badge key={provider} variant="outline" className="text-xs">
                      {provider}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Badge variant={user.isStatsPublic ? 'default' : 'outline'}>
                {user.isStatsPublic ? '통계 공개' : '통계 비공개'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for detailed info */}
      <Tabs defaultValue="settings" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="settings" className="flex items-center gap-1">
            <Settings className="h-4 w-4" />
            설정
          </TabsTrigger>
          <TabsTrigger value="categories" className="flex items-center gap-1">
            <FolderOpen className="h-4 w-4" />
            카테고리 ({user.categories?.length ?? 0})
          </TabsTrigger>
          <TabsTrigger value="memos" className="flex items-center gap-1">
            <FileText className="h-4 w-4" />
            메모 ({user.memos?.length ?? 0})
          </TabsTrigger>
          <TabsTrigger value="calendar" className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            캘린더 ({user.calendarMemos?.length ?? 0})
          </TabsTrigger>
          <TabsTrigger value="devices" className="flex items-center gap-1">
            <Smartphone className="h-4 w-4" />
            디바이스 ({user.devices?.length ?? 0})
          </TabsTrigger>
        </TabsList>

        {/* Settings Tab */}
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>사용자 설정</CardTitle>
              <CardDescription>앱 설정 및 알림 설정</CardDescription>
            </CardHeader>
            <CardContent>
              {user.settings ? (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div className="flex items-center gap-3 rounded-lg border p-4">
                    <Palette className="text-muted-foreground h-5 w-5" />
                    <div>
                      <p className="text-muted-foreground text-sm">테마</p>
                      <p className="font-medium">{user.settings.theme === 'light' ? '라이트' : '다크'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-lg border p-4">
                    <Globe className="text-muted-foreground h-5 w-5" />
                    <div>
                      <p className="text-muted-foreground text-sm">언어</p>
                      <p className="font-medium">
                        {user.settings.language === 'ko' ? '한국어' : user.settings.language}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-lg border p-4">
                    <Bell className="text-muted-foreground h-5 w-5" />
                    <div>
                      <p className="text-muted-foreground text-sm">알림</p>
                      <Badge variant={user.settings.notification ? 'default' : 'secondary'}>
                        {user.settings.notification ? '활성화' : '비활성화'}
                      </Badge>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">설정 정보가 없습니다.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Categories Tab */}
        <TabsContent value="categories">
          <Card>
            <CardHeader>
              <CardTitle>카테고리</CardTitle>
              <CardDescription>사용자가 생성한 카테고리 목록</CardDescription>
            </CardHeader>
            <CardContent>
              {user.categories && user.categories.length > 0 ? (
                <ScrollArea className="h-[400px]">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {user.categories.map((category) => (
                      <div key={category.id} className="rounded-lg border p-4">
                        <div className="flex items-center gap-2">
                          <div className="h-4 w-4 rounded-full" style={{ backgroundColor: category.color }} />
                          <span className="font-medium">{category.name}</span>
                        </div>
                        {category.fields.length > 0 && (
                          <div className="mt-2">
                            <p className="text-muted-foreground text-xs">필드:</p>
                            <div className="mt-1 flex flex-wrap gap-1">
                              {category.fields.map((field) => (
                                <Badge key={field.id} variant="outline" className="text-xs">
                                  {field.name}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        <p className="text-muted-foreground mt-2 text-xs">
                          생성일: {new Date(category.createdAt).toLocaleDateString('ko-KR')}
                        </p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <p className="text-muted-foreground">카테고리가 없습니다.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Memos Tab */}
        <TabsContent value="memos">
          <Card>
            <CardHeader>
              <CardTitle>메모</CardTitle>
              <CardDescription>사용자가 작성한 메모 목록</CardDescription>
            </CardHeader>
            <CardContent>
              {user.memos && user.memos.length > 0 ? (
                <ScrollArea className="h-[400px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>제목</TableHead>
                        <TableHead>카테고리</TableHead>
                        <TableHead>평점</TableHead>
                        <TableHead>경험일</TableHead>
                        <TableHead>작성일</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {user.memos.map((memo) => (
                        <TableRow key={memo.id}>
                          <TableCell className="font-medium">{memo.title}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{memo.categoryName}</Badge>
                          </TableCell>
                          <TableCell>
                            {memo.rating !== undefined && (
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                <span>{memo.rating}</span>
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            {memo.experienceDate && new Date(memo.experienceDate).toLocaleDateString('ko-KR')}
                          </TableCell>
                          <TableCell>{new Date(memo.createdAt).toLocaleDateString('ko-KR')}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              ) : (
                <p className="text-muted-foreground">메모가 없습니다.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Calendar Tab */}
        <TabsContent value="calendar">
          <Card>
            <CardHeader>
              <CardTitle>캘린더 메모</CardTitle>
              <CardDescription>일정 및 알림 설정</CardDescription>
            </CardHeader>
            <CardContent>
              {user.calendarMemos && user.calendarMemos.length > 0 ? (
                <ScrollArea className="h-[400px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>제목</TableHead>
                        <TableHead>시작일</TableHead>
                        <TableHead>종료일</TableHead>
                        <TableHead>종일</TableHead>
                        <TableHead>알림</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {user.calendarMemos.map((memo) => (
                        <TableRow key={memo.id}>
                          <TableCell className="font-medium">{memo.title}</TableCell>
                          <TableCell>{new Date(memo.startDate).toLocaleString('ko-KR')}</TableCell>
                          <TableCell>{new Date(memo.endDate).toLocaleString('ko-KR')}</TableCell>
                          <TableCell>
                            <Badge variant={memo.isAllDay ? 'default' : 'outline'}>
                              {memo.isAllDay ? '종일' : '시간 지정'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {memo.hasNotification ? (
                              <div className="flex items-center gap-1">
                                <Bell className="h-4 w-4 text-blue-500" />
                                <span className="text-xs">{formatNotifyBefore(memo.notifyBefore)}</span>
                              </div>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              ) : (
                <p className="text-muted-foreground">캘린더 메모가 없습니다.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Devices Tab */}
        <TabsContent value="devices">
          <Card>
            <CardHeader>
              <CardTitle>디바이스</CardTitle>
              <CardDescription>등록된 기기 및 푸시 알림 설정</CardDescription>
            </CardHeader>
            <CardContent>
              {user.devices && user.devices.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {user.devices.map((device) => (
                    <div key={device.id} className="rounded-lg border p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Smartphone className="h-5 w-5" />
                          <span className="font-medium capitalize">{device.platform}</span>
                        </div>
                        <Badge variant={device.isActive ? 'default' : 'secondary'}>
                          {device.isActive ? '활성' : '비활성'}
                        </Badge>
                      </div>
                      <Separator className="my-3" />
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">푸시 토큰</span>
                          <span className="max-w-[200px] truncate font-mono text-xs">{device.expoPushToken}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">등록일</span>
                          <span>{new Date(device.createdAt).toLocaleDateString('ko-KR')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">마지막 활동</span>
                          <span>{new Date(device.lastActiveAt).toLocaleString('ko-KR')}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">등록된 디바이스가 없습니다.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function formatNotifyBefore(notifyBefore?: string): string {
  if (!notifyBefore) return '';
  const map: Record<string, string> = {
    TEN_MINUTES_BEFORE: '10분 전',
    THIRTY_MINUTES_BEFORE: '30분 전',
    ONE_HOUR_BEFORE: '1시간 전',
    ONE_DAY_BEFORE: '1일 전',
  };
  return map[notifyBefore] || notifyBefore;
}
