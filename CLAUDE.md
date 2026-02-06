# Noturi Admin

노트리(Noturi) 서비스의 어드민 대시보드.

## 기술 스택

- **Next.js 16** (App Router, Turbopack) + **React 19.2** + **TypeScript 5**
- **Tailwind CSS 4** + **shadcn/ui** (`@/shared/ui/`에서 import, `cn()` 사용)
- **Zod 4** (스키마 → `z.infer` 타입 추론) + **React Hook Form 7**
- **Zustand 5** (인증 상태) + **TanStack Table** + **sonner** (toast)
- **pnpm** 패키지 매니저

## 명령어

```bash
pnpm dev          # 개발 서버
pnpm build        # 프로덕션 빌드 (검증용)
pnpm lint         # ESLint
pnpm format       # Prettier
pnpm dlx shadcn@latest add [name]  # shadcn/ui 컴포넌트 추가
```

## 아키텍처: FSD (Feature-Sliced Design)

의존성: `app → widgets → features → entities → shared` (역방향 금지)

| 레이어 | 역할 | 핵심 규칙 |
|--------|------|-----------|
| `app/` | 순수 라우팅만 | 비즈니스 로직 금지, pages에서 컴포넌트 import |
| `widgets/` | 복합 UI 블록 | features + entities 조합 |
| `features/` | CUD 작업 | `api/actions.ts`에 Server Actions, types 정의 금지(entities에서 import) |
| `entities/` | 읽기 전용 (GET) | `api/` + `model/types.ts` + `ui/`, 타입 중앙 관리 |
| `shared/` | 공통 모듈 | `api/`, `ui/`, `lib/` (utils, hooks, model, config) |

## 필수 규칙

- **절대경로**: 모든 import는 `@/`로 시작 (같은 폴더 내만 상대경로 허용)
- **Server Components First**: `'use client'`는 필요할 때만
- **async Dynamic APIs**: `params`, `searchParams`, `cookies()`, `headers()`는 반드시 `await`
- **any 금지**, 타입 단언 남용 금지
- **모든 api/, lib/ 폴더에 index.ts 필수** (barrel export)

## 데이터 흐름

```
Server Component → entities/api (GET) → 데이터 표시
Client Component → features/api/actions.ts (CUD) → revalidatePath → 자동 갱신
```

## 상세 규칙

아키텍처, API, React/Next.js 패턴 상세는 `.claude/rules/` 참조:
- @.claude/rules/fsd-architecture.md
- @.claude/rules/api-patterns.md
- @.claude/rules/react-nextjs-patterns.md
