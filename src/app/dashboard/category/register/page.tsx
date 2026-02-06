import Link from 'next/link';
import PageContainer from '@/shared/ui/page-container';
import { Heading } from '@/shared/ui/heading';
import { Separator } from '@/shared/ui/separator';
import { Button } from '@/shared/ui/button';
import { CategoryForm } from '@/features/category/ui/category-form';
import { ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Dashboard: Create Category',
};

export default function CreateCategoryPage() {
  return (
    <PageContainer scrollable>
      <div className="flex flex-1 flex-col space-y-4">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/category">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <Heading title="카테고리 등록" description="새로운 카테고리를 등록합니다" />
        </div>
        <Separator />
        <CategoryForm mode="create" />
      </div>
    </PageContainer>
  );
}
