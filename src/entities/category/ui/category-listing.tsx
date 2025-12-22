'use client';

import { DataTable } from '@/shared/ui/table/data-table';
import { DataTableToolbar } from '@/shared/ui/table/data-table-toolbar';

import { useDataTable } from '@/shared/ui/table/use-data-table';

import { ColumnDef } from '@tanstack/react-table';
import { parseAsInteger, useQueryState } from 'nuqs';
import { getCategoryColumns } from './category-tables/columns';
import { Category } from '../model/types';

interface CategoryTableParams {
  data: Category[];
  pageCount: number;
}

export function CategoryTable({ data, pageCount }: CategoryTableParams) {
  useQueryState('perPage', parseAsInteger.withDefault(10));

  const columns = getCategoryColumns();

  const { table } = useDataTable({
    data,
    columns,
    pageCount,
    shallow: false,
    debounceMs: 500,
  });

  return (
    <DataTable table={table}>
      <DataTableToolbar table={table} />
    </DataTable>
  );
}

