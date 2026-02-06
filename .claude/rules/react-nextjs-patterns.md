---
paths:
  - 'src/**/*.tsx'
  - 'src/**/*.ts'
---

# React 19 + Next.js 16 패턴

## Async Dynamic APIs (필수)

Next.js 16에서 `params`, `searchParams`, `cookies()`, `headers()`는 모두 async:

```typescript
// Page props
type Props = { params: Promise<{ id: string }> };

export default async function Page(props: Props) {
  const { id } = await props.params;
  // ...
}

// cookies / headers
import { cookies } from 'next/headers';
const cookieStore = await cookies();
const token = cookieStore.get('auth-token')?.value;
```

## Server Components First

- 기본은 Server Component (async 함수로 직접 데이터 fetching)
- `'use client'`는 인터랙션(state, effect, event handler)이 필요할 때만
- Server Component에서 entities API 직접 호출, Client Component에서 features Server Actions 호출

## React 19 Hooks

### useActionState (useFormState 대체)

```typescript
'use client';
import { useActionState } from 'react';

const [state, formAction, isPending] = useActionState(serverAction, initialState);
return <form action={formAction}>...</form>;
```

### useOptimistic

```typescript
const [optimisticItems, addOptimistic] = useOptimistic(items, (state, newItem) => [...state, newItem]);
```

### use()

```typescript
// Promise를 직접 읽기 (조건부 호출 가능)
import { use } from 'react';
const data = use(dataPromise);
```

## 성능 패턴

### 병렬 데이터 fetching

```typescript
// BAD: 워터폴
const users = await getUsers();
const categories = await getCategories();

// GOOD: 병렬
const [users, categories] = await Promise.all([getUsers(), getCategories()]);
```

### Suspense 경계

```typescript
import { Suspense } from 'react';

<Suspense fallback={<Skeleton />}>
  <AsyncComponent />
</Suspense>
```

### 동적 import (번들 최적화)

```typescript
import dynamic from 'next/dynamic';
const HeavyEditor = dynamic(() => import('./heavy-editor'), { ssr: false });
```

## Hydration 에러 방지

- `<table>` 안에 `<div>` 금지 — DndContext 등은 table 바깥에 배치
- Server/Client 렌더링 결과 불일치 금지
- 브라우저 전용 코드는 `useEffect` 안에서 처리

## 폼 패턴

```typescript
'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { executeAction } from '@/shared/lib';

const form = useForm<FormValues>({
  resolver: zodResolver(formSchema),
  defaultValues,
});

const onSubmit = async (values: FormValues) => {
  const result = await executeAction(() => createEntity(data), {
    successMessage: '생성되었습니다.',
    errorMessage: '저장에 실패했습니다.',
  });
  if (result !== undefined) router.push('/dashboard/entity');
};
```
