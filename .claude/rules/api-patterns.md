---
paths:
  - 'src/entities/*/api/**'
  - 'src/features/*/api/**'
  - 'src/shared/api/**'
  - 'src/app/api/**'
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

## 서버·브라우저 공용 HTTP (`#http`)

`package.json`의 `imports` 조건부 경로로 환경별 구현을 나눈다. 부르는 쪽은 같은 `import { http } from '#http'`.

| 환경                               | 구현                                            | 인증                                                            |
| ---------------------------------- | ----------------------------------------------- | --------------------------------------------------------------- |
| RSC·Server Action (`react-server`) | `shared/api/http/http.server.ts` → `serverApi`  | 서버가 쿠키의 토큰을 붙여 API 직접 호출, 401이면 세션 만료 처리 |
| 브라우저 (`default`)               | `shared/api/http/http.client.ts` → `/api/proxy` | 프록시(`app/api/proxy`)가 httpOnly 쿠키의 토큰을 붙여 전달      |

- entities 조회 함수는 `#http`를 쓴다 → 같은 함수를 Server Component와 Client Component에서 함께 사용
- 프록시는 **GET만** 허용 — 변경(CUD)은 Server Action(`serverApi`)으로만
- Client Component에서는 `useEffect`·이벤트 핸들러 안에서 부를 것 (SSR 중에는 상대 경로 `/api/proxy`가 동작하지 않음)
- `next/headers`를 쓰는 `server-api.ts`를 Client Component에서 import하지 말 것 (빌드 에러)

## 읽기 API (entities)

```typescript
import { http } from '#http';
import type { Entity, EntityListResponse, EntityQueryParams } from '../model/types';

export const getEntityList = async (params?: EntityQueryParams) => {
  return http.get<EntityListResponse>('/entities', { searchParams: params });
};

export const getEntityById = async (id: string) => {
  return http.get<Entity>(`/entities/${id}`);
};
```

- `'use server'` 없음 — Server Component에서 직접 호출, Client Component에서도 그대로 호출 가능 (`#http`)
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
