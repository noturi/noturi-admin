# Noturi Admin

노트리(Noturi) 서비스의 어드민 대시보드. API는 별도 레포 `noturi-server`(NestJS)의 `/api/admin/*`.

## 기술 스택

- **Next.js 16** (App Router, Turbopack) + **React 19.3** (React Compiler) + **TypeScript 7** (Go 기반 컴파일러)
- **Tailwind CSS 4** + **shadcn/ui** (`@/shared/ui/`에서 import, `cn()` 사용, Radix는 개별 `@radix-ui/*` 패키지)
- **Zod 4** (스키마 → `z.infer`) + **React Hook Form 7** (`useWatch` 사용, `form.watch()` 금지 — 컴파일러 최적화가 꺼짐)
- **TanStack Table** + **sonner** (toast) + **nuqs** (URL 상태), 로그는 `logger`(tslog) — `console.*` 금지
- **pnpm**

## 명령어

```bash
pnpm dev                           # 개발 서버
pnpm build                         # 프로덕션 빌드 (검증용)
npx tsc --noEmit                   # 타입 검사
pnpm lint                          # Oxlint (설정: .oxlintrc.json)
pnpm format                        # Oxfmt (설정: .oxfmtrc.json, Tailwind 클래스 정렬 포함)
pnpm dlx shadcn@latest add [name]  # shadcn/ui 컴포넌트 추가
```

- 커밋 훅은 lefthook(`lefthook.yml`): 스테이징된 파일만 `oxlint --fix` + `oxfmt`, 고친 내용은 같은 커밋에 포함. push 전 `tsc --noEmit` (ESLint·Prettier·husky는 쓰지 않음)
- 의존성: `pnpm-workspace.yaml`의 `minimumReleaseAge`로 공개 7일 안 된 버전은 설치되지 않음
- `.env.local`의 `NEXT_PUBLIC_API_URL`은 **운영 서버**를 가리킨다 — 테스트용 빌드·실행은 `NEXT_PUBLIC_API_URL=http://localhost:...`로 덮어쓸 것

## 아키텍처: FSD

의존성: `app → widgets → features → entities → shared` (역방향·같은 레이어 간 import 금지). pages 레이어는 없고 `app/`의 page가 widgets를 조합한다.
다른 슬라이스는 **public API(`@/entities/user`)로만** import — 내부 파일(`@/entities/user/api/user-api`) 직접 import 금지.

| 레이어      | 역할                 | 핵심                                                                |
| ----------- | -------------------- | ------------------------------------------------------------------- |
| `app/`      | 라우팅 + 페이지 조합 | 비즈니스 로직 금지. `api/proxy`는 브라우저용 GET 프록시             |
| `widgets/`  | 복합 UI 블록         | 슬라이스별 폴더(`widgets/{name}/ui`), features + entities 조합      |
| `features/` | CUD                  | `api/actions.ts`('use server') + `serverApi`, 폼 스키마는 `model/`  |
| `entities/` | 읽기 (GET)           | `api/`는 `#http`('use server' 금지), 도메인 타입은 `model/types.ts` |
| `shared/`   | 공통                 | `api/`(EnhancedFetch·serverApi·http), `ui/`, `lib/`                 |

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
- `/hallmark` — 새 페이지 디자인 (AI 티 나는 패턴 금지 규칙 16개 + sloplint). 이 저장소에만 설치
- `/impeccable` — 기존 화면 디자인 리뷰·개선 (`critique`, `audit`, `polish`, `harden` …). 4.8.0 고정, 처음 쓰기 전 `/impeccable init`으로 `PRODUCT.md` 생성
  - UI 파일을 고칠 때마다 탐지기 훅이 돈다 (`settings.local.json`, 팀원은 `npx impeccable@4.8.0 install --providers=claude --scope=project`)
  - Live 모드의 Apply는 채팅 세션으로만 (`settings.json`의 `IMPECCABLE_LIVE_COPY_AGENT=chat` — 권한 확인 없이 에이전트를 띄우는 경로 차단)
