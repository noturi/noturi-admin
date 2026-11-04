import { notFound, unstable_rethrow } from 'next/navigation';

import { getUserById, UserDetailView, type UserDetail } from '@/entities/user';
import { DeleteUserButton } from '@/features/user';
import { auth, can, ROUTES } from '@/shared/lib';
import { PageHeader } from '@/shared/ui/heading';
import PageContainer from '@/shared/ui/page-container';

export const metadata = { title: '사용자 상세 | Noturi Admin' };

export default async function UserDetailPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;

  let user: UserDetail;
  try {
    user = await getUserById(id);
  } catch (error) {
    // 세션 만료 리다이렉트(401)는 404로 바꾸지 않고 그대로 진행
    unstable_rethrow(error);
    notFound();
  }
  if (!user) notFound();

  const { user: currentUser } = await auth();
  const canDelete = !!currentUser && can(currentUser).deleteUser(user);

  return (
    <PageContainer>
      <PageHeader
        title={user.name}
        description={`@${user.nickname} · ${user.email}`}
        back={{ href: ROUTES.DASHBOARD.USER, label: '사용자 목록으로' }}
        actions={
          canDelete && (
            <DeleteUserButton
              user={{
                id: user.id,
                name: user.name,
                email: user.email,
                memoCount: user.memos?.length,
                categoryCount: user.categories?.length,
              }}
            />
          )
        }
      />
      <UserDetailView user={user} />
    </PageContainer>
  );
}
