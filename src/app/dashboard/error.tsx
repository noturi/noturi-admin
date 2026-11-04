'use client';

import { useEffect } from 'react';
import { Button } from '@/shared/ui/button';
import logger from '@/shared/lib/utils/logger';

/**
 * 대시보드 에러 화면 — API 403·5xx(HttpError → UserException)나 렌더링 오류가 나면
 * Next.js 기본 에러 화면 대신 사이드바를 유지한 채 이 화면을 보여줌 (401은 세션 만료 리다이렉트라 여기 오지 않음)
 * 운영 빌드에서는 서버 에러 메시지가 가려져(digest만 전달) 원인별 문구 대신 공통 문구를 씀
 */
export default function DashboardError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    logger.error('대시보드 렌더링 실패', error);
  }, [error]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 py-24 text-center">
      <h2 className="text-lg font-semibold">화면을 불러오지 못했어요</h2>
      <p className="text-sm text-muted-foreground">
        권한이 없거나 서버에 문제가 있어요. 잠시 후 다시 시도해 주세요. 계속되면 개발팀에 알려주세요.
      </p>
      <Button onClick={reset}>다시 시도</Button>
    </div>
  );
}
