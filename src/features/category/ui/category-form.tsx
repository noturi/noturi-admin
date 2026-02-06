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
import { Checkbox } from '@/shared/ui/checkbox';
import { ColorPicker } from '@/shared/ui/color-picker';
import { createCategory, updateCategory } from '@/features/category/api';
import { getFormDefaultValues, buildCategoryData } from './category-form.utils';
import type { Category } from '@/entities/category/model/types';
import { Loader2 } from 'lucide-react';
import { executeAction } from '@/shared/lib';

const formSchema = z.object({
  name: z.string().min(1, '카테고리 이름을 입력하세요'),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, '올바른 HEX 색상 코드를 입력하세요'),
  description: z.string().optional(),
  sortOrder: z.number().int().min(0, '0 이상의 정수를 입력하세요'),
  isActive: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

interface CategoryFormProps {
  category?: Category;
  mode: 'create' | 'edit';
}

export function CategoryForm({ category, mode }: CategoryFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: getFormDefaultValues(category),
  });

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    const data = buildCategoryData(values);

    const action =
      mode === 'create' ? () => createCategory(data) : category ? () => updateCategory(category.id, data) : null;

    if (!action) return;

    const result = await executeAction(action, {
      successMessage: mode === 'create' ? '카테고리가 생성되었습니다.' : '카테고리가 수정되었습니다.',
      errorMessage: '저장에 실패했습니다.',
    });

    if (result !== undefined) {
      router.push('/dashboard/category');
    }
    setIsSubmitting(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* 기본 정보 */}
        <Card>
          <CardHeader>
            <CardTitle>카테고리 정보</CardTitle>
            <CardDescription>카테고리 이름과 설명을 입력하세요</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>이름</FormLabel>
                  <FormControl>
                    <Input placeholder="카테고리 이름" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>설명</FormLabel>
                  <FormControl>
                    <Input placeholder="카테고리 설명 (선택)" {...field} />
                  </FormControl>
                  <FormDescription>선택 사항입니다.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* 색상 설정 */}
        <Card>
          <CardHeader>
            <CardTitle>색상 설정</CardTitle>
            <CardDescription>카테고리를 구분할 색상을 선택하세요</CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>색상</FormLabel>
                  <FormControl>
                    <ColorPicker value={field.value} onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* 추가 설정 */}
        <Card>
          <CardHeader>
            <CardTitle>추가 설정</CardTitle>
            <CardDescription>정렬 순서와 활성 상태를 설정하세요</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="sortOrder"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>정렬 순서</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      placeholder="0"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>숫자가 작을수록 먼저 표시됩니다.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center gap-2 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>활성 상태</FormLabel>
                    <FormDescription>비활성화하면 앱에서 표시되지 않습니다.</FormDescription>
                  </div>
                </FormItem>
              )}
            />
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
