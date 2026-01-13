'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { Badge } from '@/shared/ui/badge';
import { createNotification, updateNotification } from '@/features/notification/api';
import { UserSelectField } from './user-select-field';
import { DatePickerField } from './date-picker-field';
import { getFormDefaultValues, buildNotificationData, SCREEN_OPTIONS, type SendType } from './notification-form.utils';
import type { Notification } from '@/entities/notification/model/types';
import { REPEAT_DAYS_MAP } from '@/entities/notification/model/types';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const formSchema = z.object({
  title: z.string().min(1, '제목을 입력하세요'),
  body: z.string().min(1, '내용을 입력하세요'),
  screen: z.string().min(1, '화면을 선택하세요'),
  params: z.string().optional(),
  linkUrl: z.string().optional(),
  sendType: z.enum(['immediate', 'scheduled', 'repeat']),
  scheduledAt: z.date().optional(),
  scheduledTime: z.string().optional(),
  repeatDays: z.array(z.number()).optional(),
  repeatEndAt: z.date().optional(),
  isActive: z.boolean(),
  targetUserIds: z.array(z.string()).min(1, '최소 1명 이상의 사용자를 선택해야 합니다'),
});

type FormValues = z.infer<typeof formSchema>;

interface NotificationFormProps {
  notification?: Notification;
  mode: 'create' | 'edit';
}

export function NotificationForm({ notification, mode }: NotificationFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: getFormDefaultValues(notification),
  });

  const sendType = form.watch('sendType');
  const screen = form.watch('screen');
  const repeatDays = form.watch('repeatDays') || [];
  const isCustomLink = screen === 'Custom';

  const toggleRepeatDay = (day: number) => {
    const current = form.getValues('repeatDays') || [];
    if (current.includes(day)) {
      form.setValue(
        'repeatDays',
        current.filter((d) => d !== day)
      );
    } else {
      form.setValue('repeatDays', [...current, day].sort());
    }
  };

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      // JSON 파라미터 검증
      if (values.params) {
        try {
          JSON.parse(values.params);
        } catch {
          toast.error('파라미터 JSON 형식이 올바르지 않습니다.');
          setIsSubmitting(false);
          return;
        }
      }

      const data = buildNotificationData(values);

      if (mode === 'create') {
        await createNotification(data);
        toast.success('알림이 생성되었습니다.');
      } else if (notification) {
        await updateNotification(notification.id, { ...data, isActive: values.isActive });
        toast.success('알림이 수정되었습니다.');
      }

      router.push('/dashboard/notification');
    } catch (error) {
      console.error('Failed to save notification:', error);
      toast.error('저장에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* 기본 정보 */}
        <Card>
          <CardHeader>
            <CardTitle>알림 정보</CardTitle>
            <CardDescription>알림 제목과 내용을 입력하세요</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>제목</FormLabel>
                  <FormControl>
                    <Input placeholder="알림 제목" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="body"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>내용</FormLabel>
                  <FormControl>
                    <Input placeholder="알림 내용" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* 딥링크 설정 */}
        <Card>
          <CardHeader>
            <CardTitle>딥링크 설정</CardTitle>
            <CardDescription>알림 클릭 시 이동할 화면을 설정하세요</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="screen"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>화면</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="화면 선택" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {SCREEN_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {!isCustomLink && (
              <FormField
                control={form.control}
                name="params"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>파라미터 (JSON)</FormLabel>
                    <FormControl>
                      <Input placeholder='{"id": "123"}' {...field} />
                    </FormControl>
                    <FormDescription>선택 사항. JSON 형식으로 입력하세요.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {isCustomLink && (
              <FormField
                control={form.control}
                name="linkUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>링크 URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://apps.apple.com/app/id6752212896" {...field} />
                    </FormControl>
                    <FormDescription>알림 클릭 시 이동할 URL을 입력하세요. (예: 앱스토어 링크)</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </CardContent>
        </Card>

        {/* 발송 대상 */}
        <Card>
          <CardHeader>
            <CardTitle>발송 대상</CardTitle>
            <CardDescription>알림을 받을 사용자를 선택하세요</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="targetUserIds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>대상 사용자</FormLabel>
                  <FormControl>
                    <UserSelectField value={field.value || []} onChange={field.onChange} />
                  </FormControl>
                  <FormDescription>
                    {field.value?.length > 0
                      ? `${field.value.length}명의 사용자가 선택되었습니다.`
                      : '유저를 선택하지 않으면 알림이 발송되지 않습니다.'}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* 발송 설정 */}
        <Card>
          <CardHeader>
            <CardTitle>발송 설정</CardTitle>
            <CardDescription>알림 발송 방식을 설정하세요</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="sendType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>발송 타입</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="발송 타입 선택" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="immediate">즉시 발송</SelectItem>
                      <SelectItem value="scheduled">예약 발송</SelectItem>
                      <SelectItem value="repeat">반복 발송</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 예약 발송 */}
            {sendType === 'scheduled' && (
              <FormField
                control={form.control}
                name="scheduledAt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>예약 일시</FormLabel>
                    <FormControl>
                      <DatePickerField value={field.value} onChange={field.onChange} placeholder="날짜 선택" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* 반복 발송 */}
            {sendType === 'repeat' && (
              <>
                <FormField
                  control={form.control}
                  name="scheduledTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>발송 시간</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormItem>
                  <FormLabel>반복 요일</FormLabel>
                  <div className="flex gap-2">
                    {[0, 1, 2, 3, 4, 5, 6].map((day) => (
                      <Badge
                        key={day}
                        variant={repeatDays.includes(day) ? 'default' : 'outline'}
                        className="cursor-pointer"
                        onClick={() => toggleRepeatDay(day)}
                      >
                        {REPEAT_DAYS_MAP[day]}
                      </Badge>
                    ))}
                  </div>
                </FormItem>
                <FormField
                  control={form.control}
                  name="repeatEndAt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>반복 종료일</FormLabel>
                      <FormControl>
                        <DatePickerField
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="종료일 선택 (선택사항)"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            취소
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {mode === 'create' ? '생성' : '저장'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
