---
paths:
  - 'src/**/*.ts'
  - 'src/**/*.tsx'
---

# FSD 아키텍처 규칙

## 디렉토리 구조

```
src/
├── app/                          # Next.js App Router - 순수 라우팅만
├── pages/                        # 페이지 컴포넌트 (widgets 조합)
├── widgets/                      # 복합 UI 블록 (ui/ 세그먼트 필수)
├── features/{slice}/             # CUD 비즈니스 기능
│   ├── api/actions.ts            # 'use server' Server Actions
│   ├── ui/                       # Feature 전용 컴포넌트
│   ├── lib/                      # 스키마, 변환 로직
│   └── index.ts
├── entities/{slice}/             # 읽기 전용 엔티티
│   ├── api/{name}-api.ts         # GET 요청만
│   ├── model/types.ts            # Zod 스키마 + 타입 (중앙 관리)
│   ├── ui/                       # 읽기 전용 UI
│   └── index.ts
└── shared/
    ├── api/                      # EnhancedFetch, serverApi
    ├── ui/                       # shadcn/ui 컴포넌트
    └── lib/                      # utils, hooks, model, config
```

## 의존성 규칙 (엄격)

```
app → widgets → features → entities → shared
```

- 같은 레이어 간 import 금지
- 역방향 import 절대 금지
- features는 entities에서 타입/읽기 API import 가능

## 네이밍 컨벤션

| 위치          | 네이밍                                               | 예시                      |
| ------------- | ---------------------------------------------------- | ------------------------- |
| entities/api  | `get{Entity}List`, `get{Entity}ById`                 | `getUserList`             |
| features/api  | `create{Entity}`, `update{Entity}`, `delete{Entity}` | `createCategory`          |
| model/types   | `{Entity}Schema` → `type {Entity}`                   | `UserSchema` → `User`     |
| barrel export | 모든 api/, lib/, model/ 폴더에 index.ts 필수         | `export * from './types'` |

## Import 규칙

- 절대경로 `@/` 필수 (같은 폴더 내만 상대경로)
- 순서: React/Next.js → 외부 라이브러리 → `@/` 내부 모듈 → 상대경로
