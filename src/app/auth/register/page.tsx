import { redirect } from 'next/navigation';

import { ROUTES } from '@/shared/lib';

/**
 * 공개 가입 화면은 없음 — 서버 가입 API가 관리자 토큰을 요구해 로그인 없이는 동작하지 않음
 * 예전 링크는 운영자 등록 화면으로 (로그인 안 했으면 dashboard layout이 로그인 화면으로 보냄)
 */
export default function RegisterPage() {
  redirect(`${ROUTES.DASHBOARD.OPERATOR}/register`);
}
