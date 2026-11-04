'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { ROUTES, ROLE_LABELS } from '@/shared/lib';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { ConfirmSummary } from '@/shared/ui/confirm-dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';

import { registerAction } from '../api/register-action';
import { operatorRegisterSchema, type OperatorRegisterForm as FormValues } from '../model/types';

/**
 * 운영자 등록 — 한 화면 폼 (예전 3단계 퍼널은 선택지 하나짜리 역할 단계가 있었고 이전 단계로 돌아갈 수 없었음)
 * 레이아웃은 알림 작성 폼과 같음: 왼쪽 질문형 카드, 오른쪽 고정 요약 + 제출
 */
export function OperatorRegisterForm() {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(operatorRegisterSchema),
    defaultValues: { name: '', nickname: '', email: '', password: '', confirmPassword: '' },
  });
  const [name, email] = useWatch({ control: form.control, name: ['name', 'email'] });
  const isSubmitting = form.formState.isSubmitting;

  const onSubmit = async (values: FormValues) => {
    setFormError(null);
    const result = await registerAction({ ...values, role: 'ADMIN' });
    if (result?.error) {
      // 사라지는 토스트 대신 폼 위에 남겨 둠 — 이미 있는 이메일 등 무엇을 고칠지 보이게
      setFormError(result.error);
      return;
    }
    toast.success(`${values.name} 님을 운영자로 등록했어요.`);
    router.push(ROUTES.DASHBOARD.OPERATOR);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]"
      >
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>누구의 계정인가요</CardTitle>
              <CardDescription>이 이메일로 어드민에 로그인해요.</CardDescription>
            </CardHeader>
            <CardContent className="grid items-start gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>이름</FormLabel>
                    <FormControl>
                      <Input autoComplete="off" placeholder="홍길동" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="nickname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>닉네임</FormLabel>
                    <FormControl>
                      <Input autoComplete="off" placeholder="gildong" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>이메일</FormLabel>
                    <FormControl>
                      <Input type="email" autoComplete="off" placeholder="name@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>첫 비밀번호</CardTitle>
              <CardDescription>등록한 뒤 본인에게 직접 알려 주세요. 메일로 보내지지 않아요.</CardDescription>
            </CardHeader>
            <CardContent className="grid items-start gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>비밀번호</FormLabel>
                    <FormControl>
                      <Input type="password" autoComplete="new-password" {...field} />
                    </FormControl>
                    <FormDescription>8자 이상</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>비밀번호 확인</FormLabel>
                    <FormControl>
                      <Input type="password" autoComplete="new-password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-6">
          <ConfirmSummary
            items={[
              { label: '이름', value: name || '-' },
              { label: '이메일', value: email || '-' },
              { label: '권한', value: ROLE_LABELS.ADMIN },
            ]}
          />
          <p className="text-sm break-keep text-muted-foreground">
            {ROLE_LABELS.ADMIN}는 사용자 조회·기본 카테고리 관리·대시보드를 쓸 수 있어요. 알림·사용자 삭제·운영자
            관리·앱 버전은 {ROLE_LABELS.SUPER_ADMIN}만 할 수 있어요.
          </p>
          {formError && (
            <p role="alert" className="rounded-md border border-destructive/50 px-3 py-2 text-sm text-destructive">
              {formError}
            </p>
          )}
          <div className="grid grid-cols-2 gap-2">
            <Button type="button" variant="outline" onClick={() => router.push(ROUTES.DASHBOARD.OPERATOR)}>
              취소
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? '등록하는 중…' : '운영자 등록'}
            </Button>
          </div>
        </aside>
      </form>
    </Form>
  );
}
