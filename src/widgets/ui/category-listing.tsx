import { getCategoryList } from '@/entities/category/api/category-api';
import { CategoryTable } from '@/widgets/ui/category-tables/category-table';
import { auth } from '@/shared/lib/utils/auth.server';

type CategoryListingPage = Record<string, never>;

export default async function CategoryListingPage({}: CategoryListingPage) {
  const authData = await auth();

  if (!authData.user) {
    return <div>Unauthorized</div>;
  }

  const categories = await getCategoryList({ sortBy: 'sortOrder', order: 'asc' });

  return <CategoryTable data={categories} />;
}
