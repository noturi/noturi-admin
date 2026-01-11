import { getCategoryList } from '@/entities/category/api/category-api';
import { CategoryTable } from '@/entities/category/ui/category-listing';
import { getSearchParams, PageType } from '@/shared/lib/utils/search-params';
import { auth } from '@/shared/lib/utils/auth.server';

type CategoryListingPage = Record<string, never>;

export default async function CategoryListingPage({}: CategoryListingPage) {
  // Get current user from server
  const authData = await auth();

  if (!authData.user) {
    return <div>Unauthorized</div>;
  }

  // Get category-specific search params
  const { cache } = getSearchParams(PageType.CATEGORY);

  const name = cache.get('name');
  const limit = cache.get('perPage');
  const createdAt = cache.get('createdAt');

  const filters = {
    ...(name && { name }),
    ...(createdAt && { createdAt }),
  };

  const categories = await getCategoryList(filters);

  // Note: getCategoryList returns Category[] directly, not paginated response
  // For now, we'll use a simple pageCount calculation
  // You may need to adjust this based on your actual API response
  const pageCount = Math.ceil(categories.length / (limit || 10));

  return <CategoryTable data={categories} pageCount={pageCount} />;
}
