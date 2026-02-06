---
paths:
  - 'src/entities/*/api/**'
  - 'src/features/*/api/**'
  - 'src/shared/api/**'
---

# API 패턴

## Server Actions (features)

```typescript
'use server';

import { serverApi } from '@/shared/api/server-api';
import { revalidatePath } from 'next/cache';

export const createEntity = async (data: CreateEntityRequest) => {
  const result = await serverApi.post('/entities', { json: data });
  revalidatePath('/dashboard/entity');
  return result;
};
```

- `'use server'` 지시어 필수
- CUD 후 `revalidatePath`로 캐시 무효화
- 타입은 entities/model/types.ts에서 import

## 읽기 API (entities)

```typescript
import { serverApi } from '@/shared/api/server-api';
import type { Entity, EntityListResponse, EntityQueryParams } from '../model/types';

export const getEntityList = async (params?: EntityQueryParams) => {
  return serverApi.get<EntityListResponse>('/entities', { searchParams: params });
};

export const getEntityById = async (id: string) => {
  return serverApi.get<Entity>(`/entities/${id}`);
};
```

- `'use server'` 없음 — Server Component에서 직접 호출
- searchParams로 쿼리 파라미터 전달

## 뮤테이션 호출 패턴

클라이언트에서 CUD 호출 시 `executeAction` 유틸리티 사용:

```typescript
import { executeAction } from '@/shared/lib';

await executeAction(() => deleteEntity(id), {
  successMessage: '삭제되었습니다.',
  errorMessage: '삭제에 실패했습니다.',
});
```

## Zod 타입 패턴

```typescript
import { z } from 'zod';
import { PaginatedResponse } from '@/shared/api/types';

export const EntitySchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Entity = z.infer<typeof EntitySchema>;
export type EntityListResponse = PaginatedResponse<Entity>;
```

- Zod 스키마 먼저 정의 → `z.infer`로 타입 추론
- 타입 직접 정의 금지 — 항상 스키마에서 추론
