import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

import { Button } from './button';
import { Separator } from './separator';

interface HeadingProps {
  title: string;
  description?: React.ReactNode;
}

/** 페이지 제목 — 화면마다 h1 하나. 보통은 PageHeader를 쓰고, 이것만 단독으로 쓰는 일은 드묾 */
export const Heading = ({ title, description }: HeadingProps) => {
  return (
    <div className="min-w-0">
      <h1 className="text-2xl font-bold tracking-tight break-keep md:text-3xl">{title}</h1>
      {description && <p className="mt-1 text-sm break-keep text-muted-foreground">{description}</p>}
    </div>
  );
};

interface PageHeaderProps extends HeadingProps {
  /** 뒤로가기 — 상세·작성 화면에서 목록으로 */
  back?: { href: string; label: string };
  /** 오른쪽 작업 버튼 (주 작업 1개 + 보조 작업) */
  actions?: React.ReactNode;
}

/**
 * 모든 화면의 머리글: [뒤로] 제목·설명 ……… 작업 버튼, 아래 구분선
 * 뒤로가기는 Link를 Button으로 렌더 (Link 안에 Button을 넣으면 인터랙티브 요소가 중첩됨)
 */
export function PageHeader({ title, description, back, actions }: PageHeaderProps) {
  return (
    <header className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
        <div className="flex min-w-0 items-start gap-3">
          {back && (
            <Button
              variant="outline"
              size="icon"
              aria-label={back.label}
              nativeButton={false}
              render={<Link href={back.href} />}
              className="mt-0.5 shrink-0 md:mt-1"
            >
              <ArrowLeft />
            </Button>
          )}
          <Heading title={title} description={description} />
        </div>
        {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
      </div>
      <Separator />
    </header>
  );
}
