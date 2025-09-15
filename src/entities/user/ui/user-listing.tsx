'use client';

import { DataTable } from '@/shared/ui/table/data-table';
import { DataTableToolbar } from '@/shared/ui/table/data-table-toolbar';

import { useDataTable } from '@/shared/ui/table/use-data-table';

import { ColumnDef } from '@tanstack/react-table';
import { parseAsInteger, useQueryState } from 'nuqs';

interface UserTableParams<TData, TValue> {
  data: TData[];
  totalItems: number;
  columns: ColumnDef<TData, TValue>[];
}
export function UserTable<TData, TValue>({ data, totalItems, columns }: UserTableParams<TData, TValue>) {
  const [pageSize] = useQueryState('perPage', parseAsInteger.withDefault(10));

  const pageCount = Math.ceil(totalItems / pageSize);

  const { table } = useDataTable({
    data,
    columns,
    pageCount: pageCount,
    shallow: false,
    debounceMs: 500,
  });

  return (
    <DataTable table={table}>
      <DataTableToolbar table={table} />
    </DataTable>
  );
}
