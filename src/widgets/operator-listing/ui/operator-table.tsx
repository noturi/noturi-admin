'use client';

import { Operator } from '@/entities/operator';
import { type AuthUser } from '@/shared/lib/permissions';
import { DataTable } from '@/shared/ui/table/data-table';
import { DataTableToolbar } from '@/shared/ui/table/data-table-toolbar';
import { useDataTable } from '@/shared/ui/table/use-data-table';

import { getOperatorColumns } from './columns';

interface OperatorTableParams {
  data: Operator[];
  pageCount: number;
  totalCount?: number;
  currentUser: AuthUser;
}

export function OperatorTable({ data, pageCount, totalCount, currentUser }: OperatorTableParams) {
  const columns = getOperatorColumns(currentUser);

  const { table } = useDataTable({
    data,
    columns,
    pageCount,
    shallow: false,
    debounceMs: 500,
    initialState: { sorting: [{ id: 'createdAt', desc: true }] },
  });

  return (
    <DataTable
      table={table}
      totalCount={totalCount}
      emptyMessage="등록된 운영자가 없어요."
      filteredEmptyMessage="조건에 맞는 운영자가 없어요."
    >
      <DataTableToolbar table={table} />
    </DataTable>
  );
}
