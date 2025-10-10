# Claude Development Guidelines

이 파일은 Claude AI 어시스턴트가 이 프로젝트를 이해하고 작업할 때 참고하는 가이드라인입니다.

## 핵심 아키텍처 규칙

### FSD (Feature-Sliced Design) 구조

**엄격한 의존성 규칙을 따릅니다 (상위 레이어는 하위 레이어에만 의존):**

```
app → widgets → features → entities → shared
```

```
project/
├── src/
│   ├── app/                      # Next.js App Router 전용 - 순수 라우팅만
│   │   ├── (auth)/               # Route Groups
│   │   ├── dashboard/            # 대시보드 라우트
│   │   ├── layout.tsx            # 루트 레이아웃 (최소한의 코드만)
│   │   ├── providers.tsx         # 전역 Provider들
│   │   └── ...                   # 기타 라우트 파일들
│   │
│   ├── pages/                    # 페이지 컴포넌트들
│   ├── widgets/                  # 복합 UI 블록 (사이드바, 헤더 등)
│   ├── features/                 # 비즈니스 기능 (CUD 작업)
│   ├── entities/                 # 비즈니스 엔티티 (읽기 전용)
│   └── shared/                   # 공통 모듈들
│       ├── api/                  # API 클라이언트, 설정
│       ├── ui/                   # 재사용 가능한 UI 컴포넌트 (shadcn/ui)
│       └── lib/                  # 유틸리티, 상수, 훅, 설정 등
│           ├── model/            # 상수, 타입, 스키마
│           ├── config/           # 설정, 인증, 쿼리
│           ├── utils/            # 유틸리티 함수
│           └── hooks/            # 커스텀 훅
```

### FSD 레이어별 역할

#### **entities**: 비즈니스 엔티티 (읽기 전용)

- 데이터베이스 타입을 읽기 전용으로 사용
- 뷰모델 타입 (display/read 컴포넌트용)
- `api/`, `lib/`, `ui/` 구조 (model은 lib 하위)
- **중요**: 모든 읽기 작업 (GET/SELECT)은 entities 레이어에

#### **features**: 비즈니스 로직 (CUD 작업)

- `api/actions.ts`: Server Actions (create*, update*, delete* 등)
- `lib/` 폴더에 스키마, 타입 등 (model은 lib 하위)
- 데이터 변환 (데이터베이스 ↔ 뷰모델)
- **중요**: features는 entities에서 읽기 작업 import 가능

#### **widgets**: 복합 UI 블록

- 여러 features나 entities를 조합한 UI 컴포넌트
- `ui/` 세그먼트 필수
- 각 슬라이스는 `index.ts`로 깔끔한 public API 제공

#### **shared**: 공통 모듈

- `api/`: API 클라이언트, 설정
- `ui/`: shadcn/ui 등 재사용 가능한 UI 컴포넌트
- `lib/`: 모든 공통 라이브러리
  - `lib/model/`: 상수, 타입, 스키마
  - `lib/config/`: 설정, 인증, 쿼리
  - `lib/utils/`: 유틸리티 함수
  - `lib/hooks/`: 커스텀 훅

## 디렉토리 역할

### `src/app/` (Next.js App Router 전용)

- 순수 라우팅만 담당
- 최소한의 코드만 포함
- pages에서 실제 컴포넌트 import

### `src/pages/` (페이지 컴포넌트)

- 실제 페이지 로직과 UI 구성
- widgets 조합으로 페이지 구성

## Import 규칙

### 절대경로 사용 (@/로 시작)

- 모든 내부 모듈은 `@/`로 시작하는 절대경로 사용
- 상대경로 금지 (같은 폴더 내 파일 제외)

### Import 순서

1. React 및 Next.js
2. 외부 라이브러리
3. 내부 모듈 (@/로 시작)
4. 같은 폴더 내 파일만 상대경로

## 모듈 구조

### Features 구조

- `api/actions.ts`: Server Actions (CUD 작업)
- `lib/`: 비즈니스 로직 & Service Layer
- `ui/`: Feature 전용 UI 컴포넌트
- `index.ts`: feature 전체 export

### 레이어별 역할 분리

- **API Layer**: 순수하게 서버 데이터만 조회/변경
- **Service Layer**: 데이터 변환, 비즈니스 로직 처리
- **UI Layer**: Feature 전용 컴포넌트

### Types 위치

- 모든 타입은 entities에 중앙 관리
- features에서 types 정의 금지

## TypeScript 설정

절대경로 설정: `@/*": ["./src/*"]`

## Zod 타입 패턴

### 스키마 정의 및 타입 추론

- Zod로 스키마 정의 후 `z.infer`로 타입 추론
- 추론된 타입을 별도 변수에 저장하여 재사용
- Response, Query, Mutation 등에서 동일 타입 활용

### 타입 재사용 패턴

- Base 타입을 먼저 정의
- Response, Request, Query 등으로 확장하여 사용
- 중복 타입 정의 방지 및 일관성 유지

## Server Components First

### 기본 원칙

- 기본적으로 Server Components 사용
- `'use client'` 지시어는 필요한 경우에만 사용
- 데이터 fetching은 Server Components 또는 Server Actions에서 처리

## Lint 규칙

### 필수 수정 사항들

1. **Types 경로 수정**: entities로 import 경로 변경
2. **Missing exports 해결**: 모든 lib, api 폴더에 index.ts 필수
3. **React hooks dependency**: useEffect dependency 누락 해결

## 개발 워크플로우

### 개발 서버

- `pnpm dev`: 개발 서버 시작
- `pnpm build`: 빌드 테스트
- `pnpm lint`: 린트 체크
- `pnpm format`: Prettier 실행

## TypeScript 규칙

### 절대 금지

- any 사용 금지
- 타입 단언 남용 금지

### 올바른 방법

- 명시적 타이핑 사용
- 타입 안전한 라우팅 (ROUTES 상수 활용)

## API 패턴 (Server Actions)

### API 구조

- **entities/[entity]/api/**: 읽기 전용 Server Actions (GET)
- **features/[entity]/api/actions.ts**: CUD Server Actions
- **shared/api/**: 공통 API 클라이언트 및 설정

### 네이밍 규칙

- GET Actions: `getUserList`, `getUserById`
- CUD Actions: `createUser`, `updateUser`, `deleteUser`
- 모든 Actions는 `'use server'` 지시어 사용

### 데이터 흐름

- **Server Components**: entities API에서 직접 데이터 페칭
- **Client Components**: features API의 Server Actions 호출
- **revalidatePath**: CUD 작업 후 자동 페이지 새로고침

## shadcn/ui 사용 규칙

### 컴포넌트 추가

`pnpm dlx shadcn@latest add [component-name]`

### 사용 패턴

- `@/shared/ui/`에서 import
- `cn()` 함수로 className 조합

## 인증 & 권한

### Auth Store 패턴

- Zustand + persist 미들웨어 사용
- token, user, isAuthenticated 상태 관리
- login, logout 액션 제공

## 에러 해결 패턴

### Module resolution 에러

1. tsconfig.json path mapping 확인
2. Import 경로가 올바른지 확인 (`@/` 사용)

### Build 에러

1. Server/Client Components 구분 확인
2. `'use client'` 필요한 곳에만 사용
3. TypeScript 에러 모두 해결

### Hydration 에러

1. Server와 Client 렌더링 결과 일치 확인
2. `useEffect`로 Client-only 코드 처리

---

## 중요 원칙

### 기술 스택

- **Framework**: Next.js 15 with App Router
- **Package Manager**: pnpm
- **Build Tool**: Turbopack
- **UI**: shadcn/ui + Tailwind CSS
- **State**: React hooks + Server Actions
- **Language**: TypeScript

### Server Components First

- 기본적으로 Server Components 사용
- `'use client'` 지시어는 필요할 때만 사용
- 데이터 fetching은 Server Components나 Server Actions에서 처리

---

**주요 아키텍처 원칙**:

- FSD 레이어 의존성 규칙 준수
- Server Components First 원칙
- 절대경로(`@/`) 통일
- Types는 entities에 중앙 관리
- 비즈니스 로직과 라우팅 분리
