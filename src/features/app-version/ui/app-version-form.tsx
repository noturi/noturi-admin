'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';

import {
  compareVersions,
  PLATFORMS,
  VERSION_PATTERN,
  type AppVersion,
  type AppVersionInput,
} from '@/entities/app-version';
import { executeAction, formatKstDateTime } from '@/shared/lib';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { ConfirmDialog, ConfirmSummary } from '@/shared/ui/confirm-dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';

import { updateAppVersion } from '../api/actions';

const version = z.string().trim().regex(VERSION_PATTERN, '1.5.3처럼 숫자 세 자리로 입력하세요');
const storeUrl = z.string().trim().url('https://로 시작하는 스토어 주소를 입력하세요');

const formSchema = z
  .object({
    iosVersion: version,
    iosMinVersion: version,
    iosStoreUrl: storeUrl,
    androidVersion: version,
    androidMinVersion: version,
    androidStoreUrl: storeUrl,
  })
  .superRefine((values, ctx) => {
    // 최소 > 최신이면 최신 버전을 쓰는 사람까지 강제 업데이트 화면에 갇힘
    for (const { key } of PLATFORMS) {
      if (compareVersions(values[`${key}MinVersion`], values[`${key}Version`]) > 0) {
        ctx.addIssue({
          code: 'custom',
          path: [`${key}MinVersion`],
          message: '최신 버전보다 높을 수 없어요',
        });
      }
    }
  });

type FormValues = z.infer<typeof formSchema>;

const EMPTY: FormValues = {
  iosVersion: '',
  iosMinVersion: '',
  iosStoreUrl: '',
  androidVersion: '',
  androidMinVersion: '',
  androidStoreUrl: '',
};

/** 최소 지원 버전을 올린 플랫폼 — 그 아래 버전 사용자는 업데이트 전까지 앱을 못 씀 */
function raisedMinimums(before: AppVersion | null, values: FormValues) {
  return PLATFORMS.flatMap(({ key, label }) => {
    const from = before?.[`${key}MinVersion`] ?? '';
    const to = values[`${key}MinVersion`];
    return !from || compareVersions(to, from) > 0 ? [{ label, from, to }] : [];
  });
}

/**
 * 앱 강제·선택 업데이트 설정 — 앱(noturi-client update-check)이 실행할 때 이 값으로 판단
 * 현재 < 최소 지원: 업데이트 전까지 앱 사용 불가 / 현재 < 최신: 닫을 수 있는 "새 버전" 안내
 */
export function AppVersionForm({ appVersion }: { appVersion: AppVersion | null }) {
  const router = useRouter();
  const [pending, setPending] = useState<FormValues | null>(null);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: appVersion
      ? {
          iosVersion: appVersion.iosVersion,
          iosMinVersion: appVersion.iosMinVersion,
          iosStoreUrl: appVersion.iosStoreUrl,
          androidVersion: appVersion.androidVersion,
          androidMinVersion: appVersion.androidMinVersion,
          androidStoreUrl: appVersion.androidStoreUrl,
        }
      : EMPTY,
  });
  const values = useWatch({ control: form.control }) as FormValues;
  const isSubmitting = form.formState.isSubmitting;

  const save = async (data: AppVersionInput) => {
    const result = await executeAction(() => updateAppVersion(data), {
      successMessage: '앱 버전 설정을 저장했어요. 앱을 새로 여는 사용자부터 적용돼요.',
      errorMessage: '저장하지 못했어요.',
    });
    if (result.ok) {
      form.reset(data);
      router.refresh();
    }
    return result.ok;
  };

  const onSubmit = async (data: FormValues) => {
    // 최소 버전을 올리는 건 사용자를 막는 일 — 한 번 더 확인
    if (raisedMinimums(appVersion, data).length > 0) {
      setPending(data);
      return;
    }
    await save(data);
  };

  const raised = pending ? raisedMinimums(appVersion, pending) : [];

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]"
      >
        <div className="space-y-6">
          {PLATFORMS.map(({ key, label, store }) => (
            <Card key={key}>
              <CardHeader>
                <CardTitle>{label}</CardTitle>
                <CardDescription>
                  최신 버전은 {store}에 실제로 올라간 뒤에 바꾸세요. 먼저 바꾸면 업데이트할 게 없는 안내가 떠요.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid items-start gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name={`${key}Version`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>최신 버전</FormLabel>
                      <FormControl>
                        <Input inputMode="decimal" placeholder="1.5.3" className="tabular-nums" {...field} />
                      </FormControl>
                      <FormDescription>이보다 낮으면 &quot;새 버전&quot; 안내 (닫을 수 있음)</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`${key}MinVersion`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>최소 지원 버전</FormLabel>
                      <FormControl>
                        <Input inputMode="decimal" placeholder="1.5.0" className="tabular-nums" {...field} />
                      </FormControl>
                      <FormDescription>이보다 낮으면 업데이트 전까지 앱을 못 써요</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`${key}StoreUrl`}
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel>{store} 주소</FormLabel>
                      <FormControl>
                        <Input type="url" placeholder="https://" {...field} />
                      </FormControl>
                      <FormDescription>업데이트 버튼을 누르면 이 주소가 열려요.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          ))}
        </div>

        <aside className="space-y-4 lg:sticky lg:top-6">
          <section aria-label="사용자에게 보이는 것" className="space-y-3 rounded-lg border p-4 text-sm">
            <p className="font-medium">사용자에게 보이는 것</p>
            {PLATFORMS.map(({ key, label }) => (
              <PlatformOutcome
                key={key}
                label={label}
                latest={values[`${key}Version`]}
                minimum={values[`${key}MinVersion`]}
              />
            ))}
          </section>
          {appVersion && (
            <p className="text-xs text-muted-foreground tabular-nums">
              마지막 저장 {formatKstDateTime(appVersion.updatedAt)}
            </p>
          )}
          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={!form.formState.isDirty || isSubmitting}
              onClick={() => form.reset()}
            >
              되돌리기
            </Button>
            <Button type="submit" disabled={!form.formState.isDirty || isSubmitting}>
              {isSubmitting && <Loader2 className="animate-spin" aria-hidden />}
              저장
            </Button>
          </div>
        </aside>
      </form>

      <ConfirmDialog
        open={!!pending}
        onOpenChange={(open) => !open && setPending(null)}
        title="최소 지원 버전을 올릴까요?"
        description="그보다 낮은 버전을 쓰는 사용자는 업데이트하기 전까지 앱을 쓸 수 없어요. 스토어에 새 버전이 올라가 있는지 먼저 확인하세요."
        confirmLabel="올리고 저장"
        variant="destructive"
        onConfirm={async () => {
          if (!pending) return true;
          const ok = await save(pending);
          if (ok) setPending(null);
          return ok;
        }}
      >
        <ConfirmSummary
          items={raised.map(({ label, from, to }) => ({
            label,
            value: from ? `${from} → ${to} (${to} 미만 사용 불가)` : `${to} (${to} 미만 사용 불가)`,
          }))}
        />
      </ConfirmDialog>
    </Form>
  );
}

function PlatformOutcome({ label, latest, minimum }: { label: string; latest: string; minimum: string }) {
  if (!VERSION_PATTERN.test(latest ?? '') || !VERSION_PATTERN.test(minimum ?? '')) {
    return <p className="text-muted-foreground">{label}: 버전을 입력하면 보여요</p>;
  }
  return (
    <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1">
      <dt className="col-span-2 font-medium">{label}</dt>
      <dt className="text-muted-foreground tabular-nums">{minimum} 미만</dt>
      <dd className="text-destructive">업데이트해야 사용 가능</dd>
      {compareVersions(minimum, latest) < 0 && (
        <>
          <dt className="text-muted-foreground tabular-nums">
            {minimum} ~ {latest} 미만
          </dt>
          <dd>새 버전 안내 (닫을 수 있음)</dd>
        </>
      )}
      <dt className="text-muted-foreground tabular-nums">{latest} 이상</dt>
      <dd>안내 없음</dd>
    </dl>
  );
}
