---
name: Noturi Admin
description: 노트리 앱 운영팀이 사용자·카테고리·푸시 알림을 관리하는 내부 대시보드
colors:
  background: 'oklch(1 0 0)'
  foreground-ink: 'oklch(0.13 0.028 261.692)'
  primary-slate: 'oklch(0.21 0.034 264.665)'
  primary-foreground: 'oklch(0.985 0.002 247.839)'
  muted-mist: 'oklch(0.967 0.003 264.542)'
  muted-foreground: 'oklch(0.551 0.027 264.364)'
  border-haze: 'oklch(0.928 0.006 264.531)'
  ring: 'oklch(0.707 0.022 261.325)'
  destructive: 'oklch(0.577 0.245 27.325)'
  sidebar-paper: 'oklch(0.985 0.002 247.839)'
  rating: 'oklch(0.795 0.184 86.047)'
typography:
  display:
    fontFamily: 'Pretendard Variable, Pretendard, system-ui, sans-serif'
    fontSize: '1.875rem'
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: '-0.025em'
  headline:
    fontFamily: 'Pretendard Variable, Pretendard, system-ui, sans-serif'
    fontSize: '1.5rem'
    fontWeight: 700
    lineHeight: 1.33
    letterSpacing: '-0.025em'
  title:
    fontFamily: 'Pretendard Variable, Pretendard, system-ui, sans-serif'
    fontSize: '0.875rem'
    fontWeight: 600
    lineHeight: 1
  body:
    fontFamily: 'Pretendard Variable, Pretendard, system-ui, sans-serif'
    fontSize: '0.875rem'
    fontWeight: 400
    lineHeight: 1.43
  label:
    fontFamily: 'Pretendard Variable, Pretendard, system-ui, sans-serif'
    fontSize: '0.75rem'
    fontWeight: 500
    lineHeight: 1.33
rounded:
  sm: '6px'
  md: '8px'
  lg: '10px'
  xl: '14px'
spacing:
  page-mobile: '16px'
  page-desktop: '24px'
  stack: '16px'
  card: '24px'
components:
  button-primary:
    backgroundColor: '{colors.primary-slate}'
    textColor: '{colors.primary-foreground}'
    rounded: '{rounded.md}'
    padding: '8px 16px'
    height: '36px'
  button-outline:
    backgroundColor: '{colors.background}'
    textColor: '{colors.foreground-ink}'
    rounded: '{rounded.md}'
    padding: '8px 16px'
    height: '36px'
  button-destructive:
    backgroundColor: '{colors.destructive}'
    textColor: '{colors.primary-foreground}'
    rounded: '{rounded.md}'
    padding: '8px 16px'
    height: '36px'
  input:
    backgroundColor: '{colors.background}'
    textColor: '{colors.foreground-ink}'
    rounded: '{rounded.md}'
    padding: '4px 12px'
    height: '36px'
  card:
    backgroundColor: '{colors.background}'
    textColor: '{colors.foreground-ink}'
    rounded: '{rounded.xl}'
    padding: '{spacing.card}'
  badge:
    backgroundColor: '{colors.primary-slate}'
    textColor: '{colors.primary-foreground}'
    rounded: '{rounded.md}'
    padding: '2px 8px'
  nav-item-active:
    backgroundColor: '{colors.muted-mist}'
    textColor: '{colors.primary-slate}'
    rounded: '{rounded.md}'
    padding: '8px'
---

<!-- `/impeccable document` 스캔 모드로 작성: src/app/globals.css, src/shared/ui/*, 화면 코드에서 추출. 문체(이름·북극성)는 사용자 확인 없이 정했음 — 바꿔도 된다. -->

# Design System: Noturi Admin

## Overview

**Creative North Star: "The Quiet Ledger"** — 장부처럼 조용하고 정확한 운영 도구. 장식보다 숫자·이름·날짜가 먼저 읽히고, 색은 상태와 위험을 알릴 때만 쓴다.

shadcn/ui의 `new-york` 스타일 + `gray` 기본 색을 거의 그대로 쓰는 중립적인 시스템이다. 거의 무채색에 가까운 푸른 기가 도는 회색(hue 약 260)이 전부이고, 강조색은 따로 없다. 화면은 왼쪽 사이드바 + 흰 본문, 본문은 제목(Heading) → 도구 줄(검색·필터) → 테이블 또는 카드 순서로 쌓인다.

**Key Characteristics:**

- 무채색 슬레이트 단일 톤, 강조색 없음 — 파괴적 작업만 빨강
- 테이블 중심 정보 밀도 (본문 14px, 행 높이 촘촘)
- 얇은 테두리와 아주 옅은 그림자(`shadow-xs`/`shadow-sm`)로 층을 구분
- 라이트·다크 모드 모두 동작 (next-themes, `.dark` 클래스 — 사이드바 하단 토글, 기본은 시스템 설정)

## Colors

### Primary

- **Ink Slate** (`oklch(0.21 0.034 264.665)`): 주 버튼 배경, 활성 탭·선택 상태, 배지 기본값. 강조색이 없는 시스템에서 "주 행동"을 나타내는 유일한 색.

### Neutral

- **Ledger White** (`oklch(1 0 0)`): 본문·카드·팝오버 배경.
- **Deep Ink** (`oklch(0.13 0.028 261.692)`): 본문 글자.
- **Mist** (`oklch(0.967 0.003 264.542)`): 보조 버튼·호버·활성 메뉴 배경(secondary/muted/accent가 같은 값).
- **Slate Whisper** (`oklch(0.551 0.027 264.364)`): 설명 문구, 표 머리글 아이콘, placeholder.
- **Haze Line** (`oklch(0.928 0.006 264.531)`): 테두리·입력칸 선·구분선.
- **Sidebar Paper** (`oklch(0.985 0.002 247.839)`): 사이드바 배경 — 본문보다 아주 약간 회색.

### Status

- **Signal Red** (`oklch(0.577 0.245 27.325)`): 삭제·오류·`aria-invalid` 테두리. 위험 작업에만.
- **Star Amber** (`--rating`, `oklch(0.795 0.184 86.047)`): 별점 표시 전용 (`text-rating`). 앱의 별점 메모 데이터를 보여줄 때만.

### Named Rules

**The One Red Rule.** 빨강은 되돌릴 수 없는 작업과 오류에만 쓴다. 상태 표시(활성/비활성, 발송 완료)는 배지 변형(default/secondary/outline)으로 구분한다.

**The Token Only Rule.** 색은 토큰(`bg-primary`, `text-destructive`, `text-muted-foreground`, `text-rating`)으로만 쓴다. Tailwind 팔레트 색(`bg-red-600` 등)은 쓰지 않는다 — 토큰은 다크 모드 값이 따로 있어 팔레트 색을 쓰면 다크 모드에서 깨진다.

카테고리 색(`CATEGORY_COLORS`, 10색)은 앱 사용자 데이터를 보여주는 값이라 디자인 토큰이 아니다. 색 견본으로만 표시한다.

## Typography

**Display/Body Font:** Pretendard Variable (npm `pretendard`, 동적 서브셋 CSS — 화면에 쓰인 글자 조각만 받음). 한글·영문·숫자가 한 글꼴로 맞는다.
**Mono Font:** 시스템 모노(`ui-monospace`) — 색상 HEX 값 등 코드성 값에만.

**Character:** 기술적이고 담백한 산세리프. 굵기는 400·500·600·700 네 단계만 쓴다.

### Hierarchy

- **Display** (700, 30px, `tracking-tight`): 페이지 제목 데스크톱 (`Heading` md 이상, 대시보드 `h1`).
- **Headline** (700, 24px, `tracking-tight`): 페이지 제목 모바일 (`Heading` 기본).
- **Title** (600, 14px): 카드 제목, 대화상자 제목은 18px/600.
- **Body** (400, 14px): 표 셀, 폼 입력(모바일 16px — iOS 확대 방지), 설명문.
- **Label** (500, 12px): 배지, 보조 설명(`text-xs text-muted-foreground`), 통계 카드 하단 문구.

### Named Rules

**The Keep Words Rule.** 좁은 칸(세그먼트 설명, 배지, 카드 보조 문구)의 한국어는 `break-keep`으로 어절 단위 줄바꿈 — 글자 중간에서 끊기지 않게. 수치 열은 `tabular-nums`.

## Layout

- 셸: 왼쪽 사이드바(데스크톱 고정, 768px 미만에서는 시트로 열림) + 본문. 모바일에서는 본문 위에 56px 상단 바(사이드바 열기 버튼 + "Noturi Admin").
- 본문 여백: 모바일 16px, 데스크톱 24px(`p-4 md:px-6`), 페이지 안 세로 간격 16px(`space-y-4`).
- 목록 페이지: `Heading` → 구분선 → 도구 줄(검색·필터·컬럼 설정) → 테이블(최소 폭 640px, 가로 스크롤) → 페이지네이션.
- 대시보드: 통계 카드 그리드 1열 → 2열(sm) → 4열(lg), 그 아래 최근 활동 카드.
- 대시보드도 목록 페이지와 같이 `PageContainer` → `Heading` → 구분선으로 시작한다.
- 상세 화면: 뒤로가기 아이콘 버튼(`aria-label` 필수) + 제목, 내용은 탭(정보/설정 등)으로 나눈다.
- 작성 폼(알림 만들기·수정): 왼쪽에 질문형 제목의 카드 묶음(언제 / 누구에게 / 무엇을 / 어디로), 오른쪽 320px에 고정(sticky) 미리보기 + 제출 버튼. 1024px 미만에서는 한 열로 쌓인다.

## Elevation & Depth

평평한 시스템. 깊이는 테두리로 만들고 그림자는 아주 옅게만.

### Shadow Vocabulary

- **Hairline** (`shadow-xs`): 입력칸·외곽선 버튼·셀렉트 트리거.
- **Card** (`shadow-sm`): 카드, 사이드바 inset 변형.
- **Overlay** (`shadow-md` / `shadow-lg`): 팝오버·드롭다운 / 대화상자·시트. 대화상자 뒤 배경은 `bg-black/50`.

### Named Rules

**The Border First Rule.** 영역 구분은 `border`(Haze Line)로 먼저 하고, 그림자는 떠 있는 층(팝오버·대화상자)에만 키운다.

## Shapes

- 기준 반경 `--radius: 0.625rem`(10px) → sm 6px · md 8px · lg 10px · xl 14px.
- 버튼·입력칸·메뉴 항목: md(8px). 카드: xl(14px). 체크박스: 4px. 배지: md. 원형은 아바타·슬라이더 손잡이뿐.

## Components

### Buttons

- **Shape:** 8px 반경, 높이 36px(기본) / 32px(sm) / 40px(lg), 아이콘 버튼 36×36.
- **Primary:** Ink Slate 배경 + 흰 글자, 호버 시 90% 불투명.
- **Outline:** 흰 배경 + Haze Line 테두리 + `shadow-xs`, 호버 시 Mist 배경. 테이블 도구 줄 필터는 점선 테두리(`border-dashed`).
- **Destructive:** Signal Red 배경 + 흰 글자 — 삭제 확인 버튼 전용.
- **Ghost:** 배경 없음, 호버 시 Mist. 테이블 행의 ⋯ 메뉴 트리거.
- **Focus:** 테두리가 ring 색으로 바뀌고 3px 반투명 링(`ring-ring/50`).

### Inputs / Fields

- **Style:** 36px 높이, Haze Line 테두리, 투명 배경, 8px 반경, `shadow-xs`.
- **Focus:** ring 색 테두리 + 3px 링.
- **Error:** Signal Red 테두리 + 옅은 빨간 링(`aria-invalid`), 폼 메시지는 빨간 12–14px.
- **Textarea:** 입력칸과 같은 테두리·링, 최소 높이 64px. 글자 수 제한이 권장값일 때는 아래에 `17/40` 식 카운터(넘으면 빨강, 저장은 막지 않음).
- **Segmented Control** (`shared/ui/segmented-control`): 결과가 큰 단일 선택(발송 방식·반복 주기)은 Select 대신 선택지를 모두 펼친다. 각 칸에 라벨 + 한 줄 설명, 선택 시 Ink Slate 배경. Base UI RadioGroup이라 화살표 키로 이동.
- **Weekday Picker:** 월요일 시작 7칸 토글 버튼(`aria-pressed`), 키보드로 고를 수 있다.

### Cards / Containers

- **Corner Style:** 14px.
- **Background:** Ledger White, Haze Line 테두리, `shadow-sm`.
- **Internal Padding:** 위아래 24px, 좌우 24px, 요소 간 24px.

### Notification Preview

- 휴대폰 알림 모양 카드 하나(앱 아이콘 · "노트리" · 제목 1줄 · 본문 2줄 잘림) + 그 아래 평평한 요약 목록(받는 사람 / 발송 시점 / 누르면). 카드 안에 카드를 넣지 않는다.
- 즉시 발송은 버튼 문구에 인원을 넣고("지금 N명에게 발송", Destructive) 확인 대화상자에서 같은 요약을 한 번 더 보여준다.

### Chips / Badges

- **Style:** 12px/500, 8px 반경, 좌우 8px. default(Ink Slate), secondary(Mist), outline(테두리만), destructive(빨강).
- **State:** 활성/비활성·발송 상태·역할(ADMIN/SUPER_ADMIN) 표시.

### Navigation

- **Sidebar:** Sidebar Paper 배경, 상단에 "Noturi Admin" + 로그인한 관리자 이메일, 메뉴는 아이콘 + 14px 라벨, 활성/호버 시 Mist 배경. 하단에 다크 모드 토글 + 로그아웃.
- **Mobile:** 768px 미만에서 시트(왼쪽에서 밀려나옴)로 열리고, 메뉴를 누르면 닫힌다.

### Data Table (signature)

- 머리글: 정렬 가능한 열은 버튼형 머리글 + 정렬 방향 아이콘, 열 메뉴(오름차순·내림차순·숨기기).
- 도구 줄: 검색 입력 + 점선 테두리 필터 버튼(선택 개수 배지) + 컬럼 설정(오른쪽 끝).
- 행: 호버 시 `bg-muted/50`, 마지막 열은 ⋯ 메뉴(수정·삭제) → 삭제는 확인 대화상자.
- 페이지네이션: 총 개수 · 페이지당 행 수 셀렉트 · 첫/이전/다음/끝 아이콘 버튼.

## Do's and Don'ts

### Do:

- **Do** 색은 토큰으로만 — `bg-primary`, `text-destructive`, `text-muted-foreground`, `border-border`.
- **Do** 삭제·알림 발송처럼 되돌릴 수 없는 작업은 확인 대화상자 + Destructive 버튼으로.
- **Do** 새 목록 화면은 `Heading` → 도구 줄 → `DataTable` → 페이지네이션 순서를 그대로 따른다.
- **Do** 페이지 제목은 `Heading` 컴포넌트로 (24px → md 30px, 700, tracking-tight).
- **Do** 숫자 열·통계에는 `tabular-nums`.
- **Do** 새 화면은 라이트·다크 둘 다 확인한다 (`data-checked:` 같은 상태 클래스에 `dark:` 배경이 덮어쓰지 않는지).

### Don't:

- **Don't** `bg-red-600`, `text-blue-500` 같은 Tailwind 팔레트 색을 직접 쓰지 않는다.
- **Don't** 강조색을 새로 들이지 않는다. 구분이 필요하면 배지 변형·굵기·여백으로.
- **Don't** 회색 배경(`bg-muted`) 위에 `text-muted-foreground`를 올리지 않는다 — 대비 4.4:1로 AA(4.5:1) 미달.
- **Don't** 카테고리 색(`CATEGORY_COLORS`)을 UI 장식 색으로 쓰지 않는다 — 사용자 데이터 값이다.
- **Don't** 페이지 제목을 `h1`로 직접 쓰지 않는다 — 모든 화면이 `Heading`을 쓴다.
