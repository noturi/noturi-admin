'use client';

import { useActionState } from 'react';

import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';

import { loginAction } from '../api';

interface LoginFormProps {
  /** 토큰 만료로 로그아웃되어 온 경우 안내 */
  sessionExpired?: boolean;
}

/** 오류·만료 안내는 폼 위에 남김 (사라지는 토스트로는 무엇이 틀렸는지 놓치기 쉬움) */
export function LoginForm({ sessionExpired = false }: LoginFormProps) {
  const [state, formAction, isPending] = useActionState(loginAction, null);
  const notice = state?.error ?? (sessionExpired ? '로그인이 만료됐어요. 다시 로그인해 주세요.' : null);

  return (
    <main className="flex min-h-dvh items-center justify-center bg-background px-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">
            <h1>Noturi Admin</h1>
          </CardTitle>
          <CardDescription>운영자 계정으로 로그인하세요</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            {notice && (
              <p
                role={state?.error ? 'alert' : 'status'}
                className={
                  state?.error
                    ? 'rounded-md border border-destructive/50 px-3 py-2 text-sm text-destructive'
                    : 'rounded-md border px-3 py-2 text-sm text-muted-foreground'
                }
              >
                {notice}
              </p>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="username"
                placeholder="name@example.com"
                defaultValue={state?.email ?? ''}
                aria-invalid={!!state?.error || undefined}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">비밀번호</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                aria-invalid={!!state?.error || undefined}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? '로그인하는 중…' : '로그인'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
