'use client';

import { useRouter } from 'next/navigation';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';

import type { Category } from '@/entities/category';
import { executeAction, ROUTES } from '@/shared/lib';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Checkbox } from '@/shared/ui/checkbox';
import { ColorPicker } from '@/shared/ui/color-picker';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';

import { createCategory, updateCategory } from '../api/actions';
import { buildCategoryData, getFormDefaultValues } from './category-form.utils';

const formSchema = z.object({
  name: z.string().trim().min(1, '이름을 입력하세요'),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, '#RRGGBB 형식의 색상 코드를 입력하세요'),
  description: z.string().optional(),
  isActive: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

interface CategoryFormProps {
  category?: Category;
  mode: 'create' | 'edit';
  /** 새로 만들 때 순서 — 맨 뒤 (getNextSortOrder) */
  nextSortOrder?: number;
}

/**
 * 기본 카테고리 = 새 사용자가 가입할 때 앱에 처음 만들어지는 카테고리
 * 레이아웃은 알림 작성 폼과 같음: 왼쪽 카드, 오른쪽 고정 미리보기 + 저장
 */
export function CategoryForm({ category, mode, nextSortOrder = 1 }: CategoryFormProps) {
  const router = useRouter();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: getFormDefaultValues(category),
  });
  const [name, color, isActive] = useWatch({ control: form.control, name: ['name', 'color', 'isActive'] });
  const isSubmitting = form.formState.isSubmitting;

  const onSubmit = async (values: FormValues) => {
    const data = buildCategoryData(values, category?.sortOrder ?? nextSortOrder);
    const result = await executeAction(
      () => (mode === 'edit' && category ? updateCategory(category.id, data) : createCategory(data)),
      {
        successMessage: mode === 'create' ? `"${data.name}" 카테고리를 추가했어요.` : '변경 사항을 저장했어요.',
        errorMessage: '저장하지 못했어요. 같은 이름의 카테고리가 이미 있는지 확인해 주세요.',
      }
    );
    // 성공했을 때만 목록으로 — 실패하면 입력을 그대로 두고 다시 시도
    if (result.ok) router.push(ROUTES.DASHBOARD.CATEGORY);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]"
      >
        <Card>
          <CardHeader>
            <CardTitle>어떤 카테고리인가요</CardTitle>
            <CardDescription>새로 가입하는 사용자의 앱에 이 이름과 색으로 만들어져요.</CardDescription>
          </CardHeader>
          <CardContent className="grid items-start gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>이름</FormLabel>
                    <FormControl>
                      <Input placeholder="예: 영화" autoComplete="off" {...field} />
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
                    <FormLabel>메모 (선택)</FormLabel>
                    <FormControl>
                      <Input placeholder="운영자끼리 볼 설명" autoComplete="off" {...field} />
                    </FormControl>
                    <FormDescription>앱에는 보이지 않아요.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start gap-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1">
                      <FormLabel>새 사용자에게 주기</FormLabel>
                      <FormDescription>끄면 앞으로 가입하는 사용자에게 만들어지지 않아요.</FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>색</FormLabel>
                  <FormControl>
                    <ColorPicker value={field.value} onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <aside className="space-y-4 lg:sticky lg:top-6">
          <section aria-label="앱에 보이는 모습" className="space-y-2">
            <p className="text-sm text-muted-foreground">앱에 보이는 모습</p>
            <div className="flex items-center gap-2 rounded-xl border bg-card p-4 shadow-sm">
              <span
                className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-medium"
                style={{ borderColor: color }}
              >
                <span className="size-2.5 rounded-full" style={{ backgroundColor: color }} aria-hidden />
                {name?.trim() || '이름'}
              </span>
            </div>
          </section>
          <p className="text-sm break-keep text-muted-foreground">
            {isActive
              ? '저장하면 이후 가입하는 사용자부터 적용돼요. 이미 가입한 사용자의 카테고리는 바뀌지 않아요.'
              : '꺼 둔 상태로 저장해요. 새 사용자에게 만들어지지 않아요.'}
            {mode === 'create' && ' 순서는 맨 뒤에 붙고, 목록에서 끌어서 바꿀 수 있어요.'}
          </p>
          <div className="grid grid-cols-2 gap-2">
            <Button type="button" variant="outline" onClick={() => router.push(ROUTES.DASHBOARD.CATEGORY)}>
              취소
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="animate-spin" aria-hidden />}
              {mode === 'create' ? '카테고리 추가' : '변경 저장'}
            </Button>
          </div>
        </aside>
      </form>
    </Form>
  );
}
