---
description: FSD 엔티티 스캐폴딩 (api + model/types + ui + index 생성)
---

# FSD Entity 스캐폴딩

새로운 비즈니스 엔티티를 FSD 구조에 맞게 생성합니다.

**인자**: `$ARGUMENTS` — 엔티티 이름 (예: `product`, `order`, `review`)

## 동작 순서

1. **인자 파싱**: `$ARGUMENTS`에서 엔티티 이름(kebab-case)을 추출
2. **기존 엔티티 참고**: `src/entities/category/` 구조를 참고하여 동일한 패턴으로 생성
3. **파일 생성**: 아래 구조대로 파일 생성
4. **결과 보고**: 생성된 파일 목록 출력

## 생성할 파일 구조

```
src/entities/{name}/
├── api/
│   ├── {name}-api.ts       # 읽기 전용 API (GET)
│   └── index.ts            # export * from './{name}-api'
├── model/
│   ├── types.ts            # Zod 스키마 + 타입 정의
│   └── index.ts            # export * from './types'
├── ui/
│   └── (비워둠 — 필요 시 추가)
└── index.ts                # export * from './model'; export * from './api';
```

## 각 파일 템플릿

### `api/{name}-api.ts`

```typescript
import { serverApi } from '@/shared/api/server-api';
import type { {PascalName}, {PascalName}ListResponse, {PascalName}QueryParams } from '../model/types';

export const get{PascalName}List = async (params?: {PascalName}QueryParams) => {
  return serverApi.get<{PascalName}ListResponse>('/{pluralName}', {
    searchParams: params,
  });
};

export const get{PascalName}ById = async (id: string) => {
  return serverApi.get<{PascalName}>(`/{pluralName}/${id}`);
};
```

### `model/types.ts`

```typescript
import { z } from 'zod';
import { PaginatedResponse } from '@/shared/api/types';

// =================================================================================
// Core {PascalName} Entity
// =================================================================================

export const {PascalName}Schema = z.object({
  id: z.string().uuid(),
  // TODO: 엔티티 필드 정의
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type {PascalName} = z.infer<typeof {PascalName}Schema>;

// =================================================================================
// API Payloads & Responses
// =================================================================================

export type {PascalName}ListResponse = PaginatedResponse<{PascalName}>;

// =================================================================================
// API Query Parameters
// =================================================================================

export const {PascalName}QueryParamsSchema = z.object({
  keyword: z.string().optional(),
  page: z.number().min(1).optional(),
  limit: z.number().min(1).max(100).optional(),
  sort: z.array(z.string()).optional(),
});

export type {PascalName}QueryParams = z.infer<typeof {PascalName}QueryParamsSchema>;
```

### index 파일들

- `api/index.ts`: `export * from './{name}-api';`
- `model/index.ts`: `export * from './types';`
- `index.ts`: `export * from './model';` + `export * from './api';`

## 네이밍 규칙

| 입력            | kebab-case      | PascalCase     | 복수형           |
| --------------- | --------------- | -------------- | ---------------- |
| `product`       | `product`       | `Product`      | `products`       |
| `review`        | `review`        | `Review`       | `reviews`        |
| `memo-template` | `memo-template` | `MemoTemplate` | `memo-templates` |

## 함께 features도 생성할지 확인

엔티티 생성 후 사용자에게 **features 레이어도 함께 생성할지** 물어봅니다.
"예"인 경우 아래 구조를 추가 생성:

```
src/features/{name}/
├── api/
│   ├── actions.ts          # CUD Server Actions
│   └── index.ts            # export * from './actions'
└── index.ts                # export * from './api'
```

### `api/actions.ts` 템플릿

```typescript
'use server';

import { serverApi } from '@/shared/api/server-api';
import { revalidatePath } from 'next/cache';

export const create{PascalName} = async (data: unknown) => {
  const result = await serverApi.post('/{pluralName}', { json: data });
  revalidatePath('/dashboard/{name}');
  return result;
};

export const update{PascalName} = async (id: string, data: unknown) => {
  const result = await serverApi.patch(`/{pluralName}/${id}`, { json: data });
  revalidatePath('/dashboard/{name}');
  return result;
};

export const delete{PascalName} = async (id: string) => {
  const result = await serverApi.delete(`/{pluralName}/${id}`);
  revalidatePath('/dashboard/{name}');
  return result;
};
```

## 주의사항

- `@/` 절대경로 사용
- Zod 스키마 먼저 정의 → `z.infer`로 타입 추론
- 읽기(GET)는 entities, CUD는 features에 배치
- `'use server'` 지시어는 features/api/actions.ts에만 사용
- 이미 존재하는 엔티티면 생성하지 않고 안내
