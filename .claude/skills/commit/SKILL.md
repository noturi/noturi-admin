---
name: commit
description: 변경사항을 분석해 논리적 단위로 커밋을 나눠 만든다. 사용자가 /commit을 입력했을 때만 실행.
disable-model-invocation: true
---

# Commit

변경사항을 분석하고 논리적 단위로 커밋을 분리하여 생성합니다.

## 동작 순서

1. `git status`로 변경사항 확인
2. `git diff`로 상세 변경 분석
3. 논리적 단위로 커밋 분리
4. 각 커밋 생성

## 커밋 분리 가이드라인

- 기능, 컴포넌트, 관심사별로 커밋 분리
- 관련 파일 변경은 같은 커밋에 포함
- 리팩토링과 기능 추가는 분리
- 각 커밋은 독립적으로 이해 가능해야 함
- 연관 없는 변경은 별도 커밋으로 분리

## 커밋 메시지 형식

```
type(scope): 간단한 설명

- 상세 내용 1
- 상세 내용 2

```

### Type 종류

- `feat`: 새 기능
- `fix`: 버그 수정
- `refactor`: 리팩토링
- `style`: 스타일/포맷팅
- `docs`: 문서
- `chore`: 기타 작업

### Scope 예시

- `인증`, `사용자`, `운영자`, `카테고리`, `알림`, `대시보드` 등 화면·도메인 (한국어)

## 이 저장소에서 주의할 점

- pre-commit 훅(husky)이 `oxlint --fix`와 `oxfmt`를 돌린다. 커밋 뒤 파일이 다시 수정되어 있으면 포맷 변경분이니 `git add` 후 `--amend`로 합친다 (push 전일 때만).
- `git rm`으로 미리 스테이징한 삭제가 엉뚱한 커밋에 섞이지 않게, 커밋 전 `git diff --cached --name-only`로 확인한다.
- 커밋 전 확인: `npx tsc --noEmit` · `pnpm lint` · `pnpm build`
