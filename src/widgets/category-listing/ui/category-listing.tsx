import { getCategoryList } from '@/entities/category';

import { CategoryTable } from './category-table';

export async function CategoryListing() {
  const categories = await getCategoryList({ sortBy: 'sortOrder', order: 'asc' });
  return <CategoryTable data={categories} />;
}
