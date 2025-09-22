'use client';

import { useState } from 'react';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { registerEmailSchema } from '../lib/schema';

interface EmailStepProps {
  defaultValue?: string;
  next: (email: string) => void;
}

export function EmailStep({ defaultValue = '', next }: EmailStepProps) {
  const [email, setEmail] = useState(defaultValue);
  const [error, setError] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const result = registerEmailSchema.safeParse({ email });

    if (!result.success) {
      setError(result.error.issues[0]?.message || '유효한 이메일을 입력해주세요');
      return;
    }

    setError('');
    next(email);
  };

  return (
    <div className="bg-background flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-center text-2xl">회원가입</CardTitle>
          <CardDescription className="text-center">1/3단계: 이메일 주소를 입력해주세요</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="이메일을 입력하세요"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={error ? 'border-red-500' : ''}
              />
              {error && <p className="text-sm text-red-500">{error}</p>}
            </div>
            <Button type="submit" className="w-full">
              다음 단계
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
