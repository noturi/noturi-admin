'use client';

import { useState } from 'react';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { registerPasswordSchema, type FunnelState } from '../lib/types';

interface PasswordStepProps {
  defaultValues: FunnelState;
  next: (data: { password: string; confirmPassword: string }) => Promise<void>;
}

export function PasswordStep({ defaultValues, next }: PasswordStepProps) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = registerPasswordSchema.safeParse({ password, confirmPassword });

    if (!result.success) {
      const fieldErrors: { password?: string; confirmPassword?: string } = {};
      result.error.issues.forEach((error) => {
        if (error.path[0] === 'password') {
          fieldErrors.password = error.message;
        } else if (error.path[0] === 'confirmPassword') {
          fieldErrors.confirmPassword = error.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      await next({ password, confirmPassword });
    } catch (error) {
      console.error('Registration failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-background flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-center text-2xl">회원가입</CardTitle>
          <CardDescription className="text-center">3/3단계: 비밀번호를 설정해주세요</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-muted mb-4 rounded-lg p-3">
            <p className="text-muted-foreground text-sm">
              <strong>이메일:</strong> {defaultValues.email}
            </p>
            <p className="text-muted-foreground text-sm">
              <strong>역할:</strong> {defaultValues.role === 'ADMIN' ? '관리자' : '최고 관리자'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">비밀번호</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={errors.password ? 'border-red-500' : ''}
              />
              {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">비밀번호 확인</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className={errors.confirmPassword ? 'border-red-500' : ''}
              />
              {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? '가입 중...' : '회원가입 완료'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
