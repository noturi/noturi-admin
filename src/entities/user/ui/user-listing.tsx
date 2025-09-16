'use client';

import { DataTable } from '@/shared/ui/table/data-table';
import { DataTableToolbar } from '@/shared/ui/table/data-table-toolbar';

import { useDataTable } from '@/shared/ui/table/use-data-table';

import { ColumnDef } from '@tanstack/react-table';
import { parseAsInteger, useQueryState } from 'nuqs';

interface UserTableParams<TData, TValue> {
  data: TData[];
  pageCount: number;
  columns: ColumnDef<TData, TValue>[];
}
export function UserTable<TData, TValue>({ data, pageCount, columns }: UserTableParams<TData, TValue>) {
  useQueryState('perPage', parseAsInteger.withDefault(10));

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
