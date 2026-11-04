import { getCategoryList } from '@/entities/category';
import { CategoryForm, getNextSortOrder } from '@/features/category';
import { ROUTES } from '@/shared/lib';
import { PageHeader } from '@/shared/ui/heading';
import PageContainer from '@/shared/ui/page-container';

export const metadata = { title: '카테고리 추가 | Noturi Admin' };

export default async function CreateCategoryPage() {
  // 새 카테고리는 맨 뒤에 — 현재 최댓값 + 1
  const categories = await getCategoryList({ sortBy: 'sortOrder', order: 'asc' });

  return (
    <PageContainer>
      <PageHeader
        title="카테고리 추가"
        description="새로 가입하는 사용자에게 만들어질 카테고리"
        back={{ href: ROUTES.DASHBOARD.CATEGORY, label: '기본 카테고리 목록으로' }}
      />
      <CategoryForm mode="create" nextSortOrder={getNextSortOrder(categories)} />
    </PageContainer>
  );
}
