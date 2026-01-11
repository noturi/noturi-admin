import { notFound } from 'next/navigation';
import Link from 'next/link';
import PageContainer from '@/shared/ui/page-container';
import { Heading } from '@/shared/ui/heading';
import { Separator } from '@/shared/ui/separator';
import { Button } from '@/shared/ui/button';
import { getNotificationById } from '@/entities/notification/api/notification-api';
import { NotificationForm } from '@/features/notification/ui/notification-form';
import { ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Dashboard: Edit Notification',
};

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditNotificationPage(props: Props) {
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
        <div className="flex items-center gap-4">
          <Link href={`/dashboard/notification/${id}`}>
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <Heading title="알림 수정" description={notification.title} />
        </div>
        <Separator />
        <NotificationForm notification={notification} mode="edit" />
      </div>
    </PageContainer>
  );
}
