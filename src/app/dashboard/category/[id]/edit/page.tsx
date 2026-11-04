import { notFound, unstable_rethrow } from 'next/navigation';
import Link from 'next/link';
import PageContainer from '@/shared/ui/page-container';
import { Heading } from '@/shared/ui/heading';
import { Separator } from '@/shared/ui/separator';
import { Button } from '@/shared/ui/button';
import { getCategoryById } from '@/entities/category/api/category-api';
import { CategoryForm } from '@/features/category/ui/category-form';
import { ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Dashboard: Edit Category',
};

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditCategoryPage(props: Props) {
  const params = await props.params;
  const { id } = params;

  let category;
  try {
    category = await getCategoryById(id);
  } catch (error) {
    // 세션 만료 리다이렉트(401)는 404로 바꾸지 않고 그대로 진행
    unstable_rethrow(error);
    notFound();
  }

  if (!category) {
    notFound();
  }

  return (
    <PageContainer scrollable>
      <div className="flex flex-1 flex-col space-y-4">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/category">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <Heading title="카테고리 수정" description={category.name} />
        </div>
        <Separator />
        <CategoryForm category={category} mode="edit" />
      </div>
    </PageContainer>
  );
}
