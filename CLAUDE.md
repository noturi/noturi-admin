# Noturi Admin

노트리(Noturi) 서비스의 어드민 대시보드. API는 별도 레포 `noturi-server`(NestJS)의 `/api/admin/*`.

## 기술 스택

- **Next.js 16** (App Router, Turbopack) + **React 19.2** (React Compiler) + **TypeScript 5**
- **Tailwind CSS 4** + **shadcn/ui** (`@/shared/ui/`에서 import, `cn()` 사용, Radix는 개별 `@radix-ui/*` 패키지)
- **Zod 4** (스키마 → `z.infer`) + **React Hook Form 7** (`useWatch` 사용, `form.watch()` 금지 — 컴파일러 최적화가 꺼짐)
- **TanStack Table** + **sonner** (toast) + **nuqs** (URL 상태), 로그는 `logger`(tslog) — `console.*` 금지
- **pnpm**

## 명령어

```bash
pnpm dev                           # 개발 서버
pnpm build                         # 프로덕션 빌드 (검증용)
npx tsc --noEmit                   # 타입 검사
pnpm lint                          # ESLint
pnpm dlx shadcn@latest add [name]  # shadcn/ui 컴포넌트 추가
```

- pre-commit 훅(husky)이 `eslint --fix` + `prettier --write .`를 실행
- `.env.local`의 `NEXT_PUBLIC_API_URL`은 **운영 서버**를 가리킨다 — 테스트용 빌드·실행은 `NEXT_PUBLIC_API_URL=http://localhost:...`로 덮어쓸 것

## 아키텍처: FSD

의존성: `app → widgets → features → entities → shared` (역방향·같은 레이어 간 import 금지). pages 레이어는 없고 `app/`의 page가 widgets를 조합한다.

| 레이어      | 역할                 | 핵심                                                              |
| ----------- | -------------------- | ----------------------------------------------------------------- |
| `app/`      | 라우팅 + 페이지 조합 | 비즈니스 로직 금지. `api/proxy`는 브라우저용 GET 프록시           |
| `widgets/`  | 복합 UI 블록         | features + entities 조합                                          |
| `features/` | CUD                  | `api/actions.ts`('use server') + `serverApi`, 타입은 entities에서 |
| `entities/` | 읽기 (GET)           | `api/`는 `#http`, `model/types.ts`에 Zod 스키마                   |
| `shared/`   | 공통                 | `api/`(EnhancedFetch·serverApi·http), `ui/`, `lib/`               |

## 데이터 흐름과 인증

```
Server Component → entities/api → #http(서버: serverApi, 쿠키 토큰) → API
Client Component → entities/api → #http(브라우저: /api/proxy, GET만) → API
Client Component → features/api/actions.ts(Server Action) → serverApi → revalidatePath
```

- 인증은 httpOnly 쿠키(`auth-token`, `user-info`). 서버에서 `auth()`로 읽고, 쿠키 수명은 토큰 만료(exp)에 맞춘다
- API 401 → `/auth/logout?reason=expired`(쿠키 삭제) → 로그인 화면. 로그인 요청만 `publicApi`(401 = 비밀번호 오류)

## 자주 하는 실수

- Client Component에서 `@/shared/api/server-api` import → `next/headers` 때문에 빌드 에러. 조회는 entities 함수(`#http`)로
- Client Component의 `#http` 호출은 `useEffect`·이벤트 핸들러 안에서만 (SSR 중엔 `/api/proxy` 상대 경로가 동작 안 함)
- 서버 코드의 `try/catch`가 401 리다이렉트를 삼킴 → catch 첫 줄 `unstable_rethrow(error)`
- `params`·`searchParams`·`cookies()`·`headers()`는 반드시 `await`, `any` 금지, import는 `@/` 절대경로, api/·lib/에 `index.ts`

## 상세 규칙과 스킬

- `.claude/rules/` — 해당 파일을 다룰 때만 자동 로드 (`paths` 지정): `fsd-architecture.md`, `api-patterns.md`, `react-nextjs-patterns.md`
- `.claude/skills/` — `/fsd-entity [name]` 엔티티 스캐폴딩, `/commit` 논리 단위 커밋
