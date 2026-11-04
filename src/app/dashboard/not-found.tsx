import Link from 'next/link';

import { ROUTES } from '@/shared/lib';
import { Button } from '@/shared/ui/button';
import PageContainer from '@/shared/ui/page-container';

/** 없는 사용자·알림·카테고리 id로 들어왔을 때 (삭제됐거나 잘못된 링크) */
export default function DashboardNotFound() {
  return (
    <PageContainer className="items-center justify-center py-24 text-center">
      <h1 className="text-xl font-bold">찾는 항목이 없어요</h1>
      <p className="text-sm break-keep text-muted-foreground">이미 삭제됐거나 주소가 잘못됐어요.</p>
      <Button variant="outline" nativeButton={false} render={<Link href={ROUTES.DASHBOARD.HOME} />}>
        대시보드로
      </Button>
    </PageContainer>
  );
}
