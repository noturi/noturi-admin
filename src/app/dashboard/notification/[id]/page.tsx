import { notFound } from 'next/navigation';
import Link from 'next/link';
import PageContainer from '@/shared/ui/page-container';
import { Heading } from '@/shared/ui/heading';
import { Separator } from '@/shared/ui/separator';
import { Button } from '@/shared/ui/button';
import { getNotificationById } from '@/entities/notification/api/notification-api';
import { NotificationDetailView } from '@/entities/notification/ui/notification-detail-view';
import { ArrowLeft, Edit } from 'lucide-react';

export const metadata = {
  title: 'Dashboard: Notification Detail',
};

type Props = {
  params: Promise<{ id: string }>;
};

export default async function NotificationDetailPage(props: Props) {
  const params = await props.params;
  const { id } = params;

  let notification;
  try {
    notification = await getNotificationById(id);
  } catch {
    notFound();
  }

  if (!notification) {
    notFound();
  }

  return (
    <PageContainer scrollable>
      <div className="flex flex-1 flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/notification">
              <Button variant="outline" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <Heading title={notification.title} description="알림 상세 정보" />
          </div>
          <Link href={`/dashboard/notification/${id}/edit`}>
            <Button>
              <Edit className="mr-2 h-4 w-4" />
              수정
            </Button>
          </Link>
        </div>
        <Separator />
        <NotificationDetailView notification={notification} />
      </div>
    </PageContainer>
  );
}
