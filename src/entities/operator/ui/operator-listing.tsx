'use client';

import { DataTable } from '@/shared/ui/table/data-table';
import { DataTableToolbar } from '@/shared/ui/table/data-table-toolbar';

import { useDataTable } from '@/shared/ui/table/use-data-table';

import { parseAsInteger, useQueryState } from 'nuqs';
import { getOperatorColumns } from './operator-tables/columns';
import { AuthUser } from '@/shared/lib/permissions';
import { Operator } from '../model/types';

interface OperatorTableParams {
  data: Operator[];
  pageCount: number;
  currentUser: AuthUser;
}

export function OperatorTable({ data, pageCount, currentUser }: OperatorTableParams) {
  useQueryState('perPage', parseAsInteger.withDefault(10));

  const columns = getOperatorColumns(currentUser);

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
