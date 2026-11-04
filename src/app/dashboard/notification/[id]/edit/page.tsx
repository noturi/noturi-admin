import { notFound, redirect, unstable_rethrow } from 'next/navigation';

import {
  getNotificationById,
  getNotificationCapabilities,
  getNotificationStatus,
  type NotificationDetail,
} from '@/entities/notification';
import { NotificationForm } from '@/features/notification';
import { ROUTES } from '@/shared/lib';
import { PageHeader } from '@/shared/ui/heading';
import PageContainer from '@/shared/ui/page-container';

export const metadata = { title: '알림 수정 | Noturi Admin' };

export default async function EditNotificationPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const detailHref = `${ROUTES.DASHBOARD.NOTIFICATION}/${id}`;

  let notification: NotificationDetail;
  try {
    notification = await getNotificationById(id);
  } catch (error) {
    unstable_rethrow(error);
    notFound();
  }
  if (!notification) notFound();
  // 이미 보낸·놓친 1회 알림은 고쳐도 다시 나가지 않음(서버 cron은 lastSentAt 없는 것만 보냄) → 상세로
  if (!getNotificationCapabilities(getNotificationStatus(notification)).canEdit) redirect(detailHref);

  return (
    <PageContainer>
      <PageHeader
        title="알림 수정"
        description={notification.title}
        back={{ href: detailHref, label: '알림 상세로' }}
      />
      <NotificationForm notification={notification} mode="edit" />
    </PageContainer>
  );
}
