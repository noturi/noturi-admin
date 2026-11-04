'use client';

import { DataTable } from '@/shared/ui/table/data-table';
import { DataTableSearch } from '@/shared/ui/table/data-table-search';
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
      filteredEmptyMessage="조건에 맞는 사용자가 없어요. 가입일 조건을 바꿔 보세요."
      // 검색어는 열 필터가 아니라 따로 판단하지 않음 — 사용자가 0명인 경우는 사실상 검색 결과
      emptyMessage="찾는 사용자가 없어요. 검색어를 바꿔 보세요."
    >
      <DataTableToolbar
        table={table}
        leading={<DataTableSearch param="keyword" label="사용자 찾기" placeholder="이름·이메일·닉네임으로 찾기" />}
      />
    </DataTable>
  );
}
