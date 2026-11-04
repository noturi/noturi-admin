import { notFound, unstable_rethrow } from 'next/navigation';

import { getCategoryById, type Category } from '@/entities/category';
import { CategoryForm } from '@/features/category';
import { ROUTES } from '@/shared/lib';
import { PageHeader } from '@/shared/ui/heading';
import PageContainer from '@/shared/ui/page-container';

export const metadata = { title: '카테고리 수정 | Noturi Admin' };

export default async function EditCategoryPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;

  let category: Category;
  try {
    category = await getCategoryById(id);
  } catch (error) {
    // 세션 만료 리다이렉트(401)는 404로 바꾸지 않고 그대로 진행
    unstable_rethrow(error);
    notFound();
  }
  if (!category) notFound();

  return (
    <PageContainer>
      <PageHeader
        title="카테고리 수정"
        description={category.name}
        back={{ href: ROUTES.DASHBOARD.CATEGORY, label: '기본 카테고리 목록으로' }}
      />
      <CategoryForm category={category} mode="edit" />
    </PageContainer>
  );
}
