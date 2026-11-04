import { redirect } from 'next/navigation';

import { OperatorRegisterFormComponent } from '@/features/auth';
import { auth, can, ROUTES } from '@/shared/lib';
import { PageHeader } from '@/shared/ui/heading';
import PageContainer from '@/shared/ui/page-container';

export const metadata = { title: '운영자 등록 | Noturi Admin' };

export default async function OperatorRegisterPage() {
  const { user } = await auth();
  // 권한이 없으면 입력을 다 하고 나서 서버 오류를 받게 하지 않고 처음부터 막음
  if (!user || !can(user).createOperator()) redirect(ROUTES.DASHBOARD.OPERATOR);

  return (
    <PageContainer>
      <PageHeader
        title="운영자 등록"
        description="어드민에 로그인할 수 있는 관리자 계정을 만들어요"
        back={{ href: ROUTES.DASHBOARD.OPERATOR, label: '운영자 목록으로' }}
      />
      <OperatorRegisterFormComponent />
    </PageContainer>
  );
}
