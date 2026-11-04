import { notFound, unstable_rethrow } from 'next/navigation';

import { getNotificationById, NotificationDetailView, type NotificationDetail } from '@/entities/notification';
import { NotificationActions } from '@/features/notification';
import { NotificationRecipients } from '@/widgets/notification-recipients';
import { ROUTES } from '@/shared/lib';
import { PageHeader } from '@/shared/ui/heading';
import PageContainer from '@/shared/ui/page-container';

export const metadata = { title: '알림 상세 | Noturi Admin' };

export default async function NotificationDetailPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;

  let notification: NotificationDetail;
  try {
    notification = await getNotificationById(id);
  } catch (error) {
    // 세션 만료 리다이렉트(401)는 404로 바꾸지 않고 그대로 진행
    unstable_rethrow(error);
    notFound();
  }
  if (!notification) notFound();

  return (
    <PageContainer>
      <PageHeader
        title={notification.title}
        description={notification.body}
        back={{ href: ROUTES.DASHBOARD.NOTIFICATION, label: '알림 목록으로' }}
        actions={<NotificationActions notification={notification} variant="buttons" />}
      />
      <NotificationDetailView
        notification={notification}
        recipients={<NotificationRecipients userIds={notification.targetUserIds} />}
      />
    </PageContainer>
  );
}
