import Link from 'next/link';
import PageContainer from '@/shared/ui/page-container';
import { Heading } from '@/shared/ui/heading';
import { Separator } from '@/shared/ui/separator';
import { Button } from '@/shared/ui/button';
import { NotificationForm } from '@/features/notification/ui/notification-form';
import { ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Dashboard: Create Notification',
};

export default function CreateNotificationPage() {
  return (
    <PageContainer scrollable>
      <div className="flex flex-1 flex-col space-y-4">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/notification">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <Heading title="알림 생성" description="새로운 푸시 알림을 생성합니다" />
        </div>
        <Separator />
        <NotificationForm mode="create" />
      </div>
    </PageContainer>
  );
}
