import Link from 'next/link';
import PageContainer from '@/shared/ui/page-container';
import { Heading } from '@/shared/ui/heading';
import { Separator } from '@/shared/ui/separator';
import { Button } from '@/shared/ui/button';
import { NotificationForm } from '@/features/notification';
import { ArrowLeft } from 'lucide-react';

export const metadata = {
  title: '알림 만들기 | Noturi Admin',
};

export default function CreateNotificationPage() {
  return (
    <PageContainer scrollable>
      <div className="flex flex-1 flex-col space-y-4">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            aria-label="알림 목록으로"
            nativeButton={false}
            render={<Link href="/dashboard/notification" />}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Heading title="알림 만들기" description="앱 사용자 휴대폰으로 보낼 푸시 알림" />
        </div>
        <Separator />
        <NotificationForm mode="create" />
      </div>
    </PageContainer>
  );
}
