import { NotificationForm } from '@/features/notification';
import { ROUTES } from '@/shared/lib';
import { PageHeader } from '@/shared/ui/heading';
import PageContainer from '@/shared/ui/page-container';

export const metadata = { title: '알림 만들기 | Noturi Admin' };

export default function CreateNotificationPage() {
  return (
    <PageContainer>
      <PageHeader
        title="알림 만들기"
        description="앱 사용자 휴대폰으로 보낼 푸시 알림"
        back={{ href: ROUTES.DASHBOARD.NOTIFICATION, label: '알림 목록으로' }}
      />
      <NotificationForm mode="create" />
    </PageContainer>
  );
}
