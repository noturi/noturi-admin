import { getCategoryList } from '@/entities/category';
import { CategoryTable } from './category-table';
import { auth } from '@/shared/lib/utils/auth.server';

type CategoryListingPage = Record<string, never>;

export async function CategoryListing({}: CategoryListingPage) {
  const authData = await auth();

  if (!authData.user) {
    return <div>Unauthorized</div>;
  }

  const categories = await getCategoryList({ sortBy: 'sortOrder', order: 'asc' });

  return <CategoryTable data={categories} />;
}
