import { cn } from '@/shared/lib';

/**
 * 페이지 본문 틀 — 여백은 여기 한 곳에서만 (layout에는 여백 없음), 스크롤은 문서 스크롤 하나
 * 넓은 모니터에서 표·폼이 끝없이 늘어나지 않게 최대 폭을 둔다
 */
export default function PageContainer({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('mx-auto flex w-full max-w-screen-2xl flex-1 flex-col gap-6 p-4 md:p-6 lg:p-8', className)}>
      {children}
    </div>
  );
}
