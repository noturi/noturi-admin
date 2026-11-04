'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Textarea } from '@/shared/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { SegmentedControl } from '@/shared/ui/segmented-control';
import { Checkbox } from '@/shared/ui/checkbox';
import { ConfirmDialog, ConfirmSummary } from '@/shared/ui/confirm-dialog';
import { executeAction, ROUTES } from '@/shared/lib';
import type { Notification } from '@/entities/notification';
import { createNotification, updateNotification } from '../api/actions';
import { UserSelectField } from './user-select-field';
import { DatePickerField } from './date-picker-field';
import { MonthDaysGrid } from './month-days-grid';
import { WeekdayPicker } from './weekday-picker';
import { describeSendResult } from '@/entities/notification';
import { NotificationPreview } from './notification-preview';
import { useRecipientReach } from './use-recipient-reach';
import {
  getFormDefaultValues,
  buildNotificationData,
  describeSchedule,
  SCREEN_OPTIONS,
  SEND_TYPE_OPTIONS,
  type SendType,
} from './notification-form.utils';
import { formSchema, type FormValues } from './notification-form.schema';

/** 휴대폰 알림에서 대략 잘리기 시작하는 길이 — 넘어도 저장은 되지만 경고 */
const TITLE_SOFT_LIMIT = 40;
const BODY_SOFT_LIMIT = 120;

interface NotificationFormProps {
  notification?: Notification;
  mode: 'create' | 'edit';
}

const REPEAT_TYPE_OPTIONS = [
  { value: 'WEEKLY', label: '매주', hint: '요일 선택' },
  { value: 'MONTHLY', label: '매월', hint: '날짜 선택' },
] as const;

function CharCount({ value, limit }: { value: string; limit: number }) {
  const over = value.length > limit;
  return (
    <span className={over ? 'text-destructive' : 'text-muted-foreground'}>
      {value.length}/{limit}
      {over && ' · 휴대폰에서 잘려 보일 수 있어요'}
    </span>
  );
}

export function NotificationForm({ notification, mode }: NotificationFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  // 즉시 발송은 확인 창을 거친 뒤에만 보냄
  const [pendingImmediate, setPendingImmediate] = useState<FormValues | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: getFormDefaultValues(notification),
  });

  // form.watch()는 React Compiler가 메모이즈할 수 없어 컴포넌트 최적화가 꺼짐 → useWatch 사용
  const { control } = form;
  const title = useWatch({ control, name: 'title' }) ?? '';
  const body = useWatch({ control, name: 'body' }) ?? '';
  const sendType = useWatch({ control, name: 'sendType' });
  const screen = useWatch({ control, name: 'screen' });
  const linkUrl = useWatch({ control, name: 'linkUrl' });
  const scheduledAt = useWatch({ control, name: 'scheduledAt' });
  const scheduledTime = useWatch({ control, name: 'scheduledTime' });
  const repeatType = useWatch({ control, name: 'repeatType' }) || 'WEEKLY';
  const repeatDays = useWatch({ control, name: 'repeatDays' }) || [];
  const repeatMonthDays = useWatch({ control, name: 'repeatMonthDays' }) || [];
  const repeatEndAt = useWatch({ control, name: 'repeatEndAt' });
  const skipHolidays = useWatch({ control, name: 'skipHolidays' });
  const targetUserIds = useWatch({ control, name: 'targetUserIds' }) || [];

  const isCustomLink = screen === 'Custom';
  const hasLastDayCandidate = repeatMonthDays.some((day) => day >= 29);
  const targetCount = targetUserIds.length;
  const reach = useRecipientReach(targetUserIds);

  // 저장된 알림은 예약·반복만 있음(즉시 발송은 기록되지 않음) — 수정 화면에서 즉시 발송으로 바꾸면 보내지지 않으므로 숨김
  const sendTypeOptions =
    mode === 'edit' ? SEND_TYPE_OPTIONS.filter((o) => o.value !== 'immediate') : SEND_TYPE_OPTIONS;

  const schedule = describeSchedule({
    sendType,
    scheduledAt,
    scheduledTime,
    repeatType,
    repeatDays,
    repeatMonthDays,
    repeatEndAt,
    skipHolidays,
  });
  const destination = isCustomLink
    ? linkUrl || null
    : (SCREEN_OPTIONS.find((option) => option.value === screen)?.label ?? null);

  const submitLabel = (() => {
    if (mode === 'edit') return '변경 저장';
    if (sendType === 'immediate')
      return targetCount > 0 ? `지금 ${targetCount.toLocaleString()}명에게 발송` : '지금 발송';
    if (sendType === 'scheduled') return '예약 저장';
    if (sendType === 'repeat') return '반복 발송 저장';
    return '저장';
  })();

  /** 저장 성공 여부를 돌려줌 — 즉시 발송 확인창은 실패하면 열어둠 */
  const save = async (values: FormValues): Promise<boolean> => {
    setIsSubmitting(true);
    let ok = false;
    const data = buildNotificationData({ ...values, sendType: values.sendType as SendType });

    if (mode === 'create') {
      const result = await executeAction(() => createNotification(data), { errorMessage: '알림을 저장하지 못했어요.' });
      ok = result.ok;
      if (result.ok) {
        const sent = result.data.sendResult;
        if (sent) {
          // 즉시 발송 결과를 그대로 보여줌 — "생성되었습니다"만으로는 실제로 나갔는지 알 수 없음
          const { tone, message } = describeSendResult(sent);
          toast[tone](message);
        } else {
          toast.success(values.sendType === 'repeat' ? '반복 발송을 저장했어요' : '예약했어요');
        }
        router.push(ROUTES.DASHBOARD.NOTIFICATION);
      }
    } else if (notification) {
      const result = await executeAction(
        () => updateNotification(notification.id, { ...data, isActive: values.isActive }),
        { successMessage: '변경 사항을 저장했어요', errorMessage: '저장하지 못했어요.' }
      );
      ok = result.ok;
      if (result.ok) router.push(`${ROUTES.DASHBOARD.NOTIFICATION}/${notification.id}`);
    }
    setIsSubmitting(false);
    return ok;
  };

  const onSubmit = (values: FormValues) => {
    if (mode === 'create' && values.sendType === 'immediate') {
      setPendingImmediate(values);
      return;
    }
    void save(values);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start"
      >
        <div className="min-w-0 space-y-6">
          {/* 1. 발송 방식과 시점 — 결과가 가장 큰 결정이라 맨 위에, 선택지를 모두 펼쳐 둠 */}
          <Card>
            <CardHeader>
              <CardTitle>언제 보낼까요</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <FormField
                control={form.control}
                name="sendType"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel id="send-type-label">발송 방식</FormLabel>
                    <SegmentedControl
                      aria-label="발송 방식"
                      aria-invalid={!!fieldState.error}
                      value={field.value}
                      onValueChange={field.onChange}
                      options={sendTypeOptions}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              {sendType === 'scheduled' && (
                <div className="grid gap-4 sm:grid-cols-[1fr_180px]">
                  <FormField
                    control={form.control}
                    name="scheduledAt"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormLabel>예약 날짜</FormLabel>
                        <FormControl>
                          <DatePickerField
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="날짜 선택"
                            disablePast
                            aria-invalid={!!fieldState.error}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="scheduledTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>발송 시간 (한국 시간)</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {sendType === 'repeat' && (
                <div className="space-y-5">
                  <FormField
                    control={form.control}
                    name="scheduledTime"
                    render={({ field }) => (
                      <FormItem className="max-w-[180px]">
                        <FormLabel>발송 시간 (한국 시간)</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormItem>
                    <FormLabel>반복 주기</FormLabel>
                    <SegmentedControl
                      aria-label="반복 주기"
                      className="sm:max-w-sm"
                      value={repeatType}
                      onValueChange={(value) => form.setValue('repeatType', value)}
                      options={REPEAT_TYPE_OPTIONS}
                    />
                  </FormItem>
                  {repeatType === 'WEEKLY' && (
                    <FormField
                      control={form.control}
                      name="repeatDays"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel id="repeat-days-label">반복 요일</FormLabel>
                          <WeekdayPicker
                            aria-labelledby="repeat-days-label"
                            value={field.value || []}
                            onChange={field.onChange}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  {repeatType === 'MONTHLY' && (
                    <>
                      <FormField
                        control={form.control}
                        name="repeatMonthDays"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>반복 날짜</FormLabel>
                            <FormControl>
                              <MonthDaysGrid value={field.value || []} onChange={field.onChange} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {hasLastDayCandidate && (
                        <FormField
                          control={form.control}
                          name="sendOnLastDay"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center gap-2 space-y-0 rounded-md border p-4">
                              <FormControl>
                                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>해당 날짜가 없는 달은 말일에 발송</FormLabel>
                                <FormDescription>
                                  예: 31일을 고르면 4월에는 30일에 나가요. 끄면 그런 달에는 보내지 않아요.
                                </FormDescription>
                              </div>
                            </FormItem>
                          )}
                        />
                      )}
                    </>
                  )}
                  <FormField
                    control={form.control}
                    name="repeatEndAt"
                    render={({ field, fieldState }) => (
                      <FormItem className="sm:max-w-sm">
                        <FormLabel>반복 종료일 (선택)</FormLabel>
                        <FormControl>
                          <DatePickerField
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="정하지 않으면 계속 반복"
                            disablePast
                            clearable
                            aria-invalid={!!fieldState.error}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="skipHolidays"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center gap-2 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>공휴일 제외</FormLabel>
                          <FormDescription>발송일이 한국 공휴일이면 그날은 보내지 않아요.</FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* 2. 받는 사람 */}
          <Card>
            <CardHeader>
              <CardTitle>누구에게 보낼까요</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="targetUserIds"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>받는 사람</FormLabel>
                    <FormControl>
                      <UserSelectField value={field.value || []} onChange={field.onChange} />
                    </FormControl>
                    <FormDescription>
                      검색에는 알림을 켠 사용자만 나와요. 묶음에는 알림을 끈 사용자도 들어가며, 실제로 받을 수 있는
                      인원은 미리보기에 보여요.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* 3. 알림 내용 */}
          <Card>
            <CardHeader>
              <CardTitle>무엇을 보낼까요</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>제목</FormLabel>
                    <FormControl>
                      <Input placeholder="예: 이번 주 별점 메모를 남겨보세요" {...field} />
                    </FormControl>
                    <FormDescription>
                      <CharCount value={title} limit={TITLE_SOFT_LIMIT} />
                    </FormDescription>
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
                      <Textarea rows={3} placeholder="휴대폰 알림에 보일 문장" {...field} />
                    </FormControl>
                    <FormDescription>
                      <CharCount value={body} limit={BODY_SOFT_LIMIT} />
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* 4. 누르면 이동할 곳 */}
          <Card>
            <CardHeader>
              <CardTitle>누르면 어디로 갈까요</CardTitle>
              <CardDescription>알림을 누르면 앱의 이 화면이 열려요.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="screen"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>이동할 화면</FormLabel>
                    {/* items: 트리거에 값('Home') 대신 라벨('홈')을 보이게 (Base UI Select) */}
                    <Select items={SCREEN_OPTIONS} onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full sm:w-60" aria-invalid={!!fieldState.error}>
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
              {isCustomLink ? (
                <FormField
                  control={form.control}
                  name="linkUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>링크 주소</FormLabel>
                      <FormControl>
                        <Input inputMode="url" placeholder="https://apps.apple.com/app/id6752212896" {...field} />
                      </FormControl>
                      <FormDescription>앱 안 화면이 아닌 곳(예: 앱스토어)으로 보낼 때 써요.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : (
                <FormField
                  control={form.control}
                  name="params"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>화면에 넘길 값 (선택, JSON)</FormLabel>
                      <FormControl>
                        <Input className="font-mono" placeholder='{"id": "123"}' {...field} />
                      </FormControl>
                      <FormDescription>특정 메모·카테고리를 열 때만 넣어요.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </CardContent>
          </Card>
        </div>

        {/* 오른쪽: 미리보기·요약과 제출 — 스크롤해도 따라와서 누르기 전에 항상 검산할 수 있음 */}
        <aside className="space-y-3 lg:sticky lg:top-4">
          <NotificationPreview
            title={title}
            body={body}
            targetCount={targetCount}
            reach={reach}
            schedule={schedule}
            destination={destination}
          />
          <div className="flex gap-2">
            <Button type="button" variant="outline" className="flex-1" onClick={() => router.back()}>
              취소
            </Button>
            <Button
              type="submit"
              className="flex-[2]"
              variant={mode === 'create' && sendType === 'immediate' ? 'destructive' : 'default'}
              disabled={isSubmitting}
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {submitLabel}
            </Button>
          </div>
        </aside>
      </form>

      {/* 즉시 발송 확인 — 되돌릴 수 없으므로 요약을 한 번 더 보여줌 (PRODUCT.md 원칙 1). 보내는 동안 열어둠 */}
      <ConfirmDialog
        open={!!pendingImmediate}
        onOpenChange={(open) => !open && setPendingImmediate(null)}
        title={`지금 ${targetCount.toLocaleString()}명에게 보낼까요?`}
        description="보내면 취소할 수 없어요. 받는 사람의 휴대폰에 바로 알림이 떠요."
        confirmLabel={`${targetCount.toLocaleString()}명에게 보내기`}
        variant="destructive"
        onConfirm={async () => {
          if (!pendingImmediate) return true;
          const ok = await save(pendingImmediate);
          if (ok) setPendingImmediate(null);
          return ok;
        }}
      >
        <ConfirmSummary
          items={[
            { label: '제목', value: pendingImmediate?.title },
            {
              label: '받는 사람',
              value: reach
                ? `${targetCount.toLocaleString()}명 중 ${reach.reachable.toLocaleString()}명이 받을 수 있어요`
                : `${targetCount.toLocaleString()}명`,
            },
            { label: '내용', value: pendingImmediate?.body },
            { label: '누르면', value: destination },
          ]}
        />
      </ConfirmDialog>
    </Form>
  );
}
