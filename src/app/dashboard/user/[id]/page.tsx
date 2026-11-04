import { notFound, unstable_rethrow } from 'next/navigation';
import Link from 'next/link';
import PageContainer from '@/shared/ui/page-container';
import { Heading } from '@/shared/ui/heading';
import { Separator } from '@/shared/ui/separator';
import { Button } from '@/shared/ui/button';
import { getUserById } from '@/entities/user';
import { UserDetailView } from '@/entities/user';
import { ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Dashboard: User Detail',
};

type Props = {
  params: Promise<{ id: string }>;
};

export default async function UserDetailPage(props: Props) {
  const params = await props.params;
  const { id } = params;

  let user;
  try {
    user = await getUserById(id);
  } catch (error) {
    // 세션 만료 리다이렉트(401)는 404로 바꾸지 않고 그대로 진행
    unstable_rethrow(error);
    notFound();
  }

  if (!user) {
    notFound();
  }

  return (
    <PageContainer scrollable>
      <div className="flex flex-1 flex-col space-y-4">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/user">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <Heading title={`${user.name} 상세`} description={`@${user.nickname}의 상세 정보`} />
        </div>
        <Separator />
        <UserDetailView user={user} />
      </div>
    </PageContainer>
  );
}
