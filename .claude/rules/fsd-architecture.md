---
paths:
  - 'src/**/*.ts'
  - 'src/**/*.tsx'
---

# FSD 아키텍처 규칙

## 디렉토리 구조

```
src/
├── app/                          # Next.js App Router — 라우팅 + 페이지 조합 (pages 레이어 없음)
│   └── api/proxy/                # 브라우저 → 어드민 API GET 프록시 (#http 브라우저 구현)
├── widgets/{slice}/              # 복합 UI 블록 — 슬라이스별 폴더 (예: category-listing)
│   ├── ui/                       # 위젯 컴포넌트 (테이블·컬럼·셀 액션 포함)
│   └── index.ts                  # public API
├── features/{slice}/             # CUD 비즈니스 기능
│   ├── api/actions.ts            # 'use server' Server Actions
│   ├── ui/                       # Feature 전용 컴포넌트
│   ├── model/                    # 폼 스키마·입력 정리 함수 (도메인 타입은 entities)
│   ├── lib/                      # 변환 로직
│   └── index.ts
├── entities/{slice}/             # 읽기 전용 엔티티
│   ├── api/{name}-api.ts         # GET 요청만
│   ├── model/types.ts            # Zod 스키마 + 타입 (중앙 관리)
│   ├── ui/                       # 읽기 전용 UI
│   └── index.ts
└── shared/
    ├── api/                      # EnhancedFetch, serverApi, http/(#http 서버·브라우저 구현)
    ├── ui/                       # shadcn/ui 컴포넌트
    └── lib/                      # utils, hooks, model, config
```

## 의존성 규칙 (엄격)

```
app → widgets → features → entities → shared
```

- 같은 레이어 간 import 금지 (다른 슬라이스끼리)
- 다른 슬라이스는 **public API(index.ts)로만** import: `@/entities/user` ✅ / `@/entities/user/api/user-api` ❌
  (같은 슬라이스 안에서는 상대 경로 `../model/types`)
- shared는 어떤 레이어도 import하지 않는다 — entities 타입이 필요하면 구조 타입(`{ id: string }`)으로 받기
- entities 파일에 `'use server'` 금지 — 붙이면 조회 함수가 외부에서 호출 가능한 Server Action이 됨
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
