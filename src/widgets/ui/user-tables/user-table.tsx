'use client';

import { DataTable } from '@/shared/ui/table/data-table';
import { DataTableToolbar } from '@/shared/ui/table/data-table-toolbar';

import { useDataTable } from '@/shared/ui/table/use-data-table';

import { parseAsInteger, useQueryState } from 'nuqs';
import { getUserColumns } from './user-columns';
import { type AuthUser } from '@/shared/lib/permissions';
import { User } from '@/entities/user/model/types';

interface UserTableParams {
  data: User[];
  pageCount: number;
  currentUser: AuthUser;
}
export function UserTable({ data, pageCount, currentUser }: UserTableParams) {
  useQueryState('perPage', parseAsInteger.withDefault(10));

  const columns = getUserColumns(currentUser);

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
