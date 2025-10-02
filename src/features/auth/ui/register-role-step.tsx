'use client';

import { useState } from 'react';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Label } from '@/shared/ui/label';
import { registerRoleSchema } from '../lib/types';

interface RoleStepProps {
  defaultValue?: 'ADMIN' | 'SUPER_ADMIN';
  next: (role: 'ADMIN' | 'SUPER_ADMIN') => void;
}

export function RoleStep({ defaultValue, next }: RoleStepProps) {
  const [role, setRole] = useState<'ADMIN' | 'SUPER_ADMIN' | undefined>(defaultValue);
  const [error, setError] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const result = registerRoleSchema.safeParse({ role });

    if (!result.success) {
      setError(result.error.issues[0]?.message || '역할을 선택해주세요');
      return;
    }

    setError('');
    next(role!);
  };

  const roles = [
    {
      value: 'ADMIN' as const,
      label: '관리자',
      description: '일반 관리 권한',
      disabled: false,
    },
    {
      value: 'SUPER_ADMIN' as const,
      label: '최고 관리자',
      description: '모든 권한 포함',
      disabled: true,
    },
  ];

  return (
    <div className="bg-background flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-center text-2xl">회원가입</CardTitle>
          <CardDescription className="text-center">2/3단계: 역할을 선택해주세요</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-3">
              <Label>역할 선택</Label>
              {roles.map((roleOption) => (
                <div
                  key={roleOption.value}
                  className={`rounded-lg border p-4 transition-colors ${
                    roleOption.disabled
                      ? 'border-border bg-muted/30 cursor-not-allowed opacity-50'
                      : role === roleOption.value
                        ? 'border-primary bg-primary/5 cursor-pointer'
                        : 'border-border hover:border-primary/50 cursor-pointer'
                  }`}
                  onClick={() => !roleOption.disabled && setRole(roleOption.value)}
                >
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id={roleOption.value}
                      name="role"
                      value={roleOption.value}
                      checked={role === roleOption.value}
                      onChange={(e) => !roleOption.disabled && setRole(e.target.value as 'ADMIN' | 'SUPER_ADMIN')}
                      disabled={roleOption.disabled}
                      className="sr-only"
                    />
                    <div
                      className={`h-4 w-4 rounded-full border-2 ${
                        role === roleOption.value ? 'border-primary bg-primary' : 'border-gray-300'
                      }`}
                    >
                      {role === roleOption.value && <div className="m-0.5 h-2 w-2 rounded-full bg-white" />}
                    </div>
                    <div>
                      <p className={`font-medium ${roleOption.disabled ? 'text-muted-foreground' : ''}`}>
                        {roleOption.label}
                        {roleOption.disabled && ' (사용 불가)'}
                      </p>
                      <p className="text-muted-foreground text-sm">{roleOption.description}</p>
                    </div>
                  </div>
                </div>
              ))}
              {error && <p className="text-sm text-red-500">{error}</p>}
            </div>
            <Button type="submit" className="w-full" disabled={!role}>
              다음 단계
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
