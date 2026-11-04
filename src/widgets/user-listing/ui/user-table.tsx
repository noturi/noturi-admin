'use client';

import { DataTable } from '@/shared/ui/table/data-table';
import { DataTableToolbar } from '@/shared/ui/table/data-table-toolbar';
import { useDataTable } from '@/shared/ui/table/use-data-table';
import { type AuthUser } from '@/shared/lib/permissions';
import { User } from '@/entities/user';

import { getUserColumns } from './user-columns';

interface UserTableParams {
  data: User[];
  pageCount: number;
  totalCount?: number;
  currentUser: AuthUser;
}

export function UserTable({ data, pageCount, totalCount, currentUser }: UserTableParams) {
  const columns = getUserColumns(currentUser);

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
      emptyMessage="아직 가입한 사용자가 없어요."
      filteredEmptyMessage="조건에 맞는 사용자가 없어요. 이메일이나 가입일 조건을 바꿔 보세요."
    >
      <DataTableToolbar table={table} />
    </DataTable>
  );
}
