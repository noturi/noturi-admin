'use client';

import { Notification } from '@/entities/notification';
import { DataTable } from '@/shared/ui/table/data-table';
import { DataTableToolbar } from '@/shared/ui/table/data-table-toolbar';
import { useDataTable } from '@/shared/ui/table/use-data-table';

import { getNotificationColumns } from './columns';

interface NotificationTableParams {
  data: Notification[];
  pageCount: number;
  totalCount?: number;
}

export function NotificationTable({ data, pageCount, totalCount }: NotificationTableParams) {
  const columns = getNotificationColumns();

  const { table } = useDataTable({
    data,
    columns,
    pageCount,
    shallow: false,
    debounceMs: 500,
    // 종류·켜짐 열은 필터 전용
    initialState: { columnVisibility: { isRepeat: false, isActive: false } },
  });

  return (
    <DataTable
      table={table}
      totalCount={totalCount}
      emptyMessage="아직 만든 알림이 없어요. 오른쪽 위 '알림 만들기'로 시작하세요."
      filteredEmptyMessage="조건에 맞는 알림이 없어요."
    >
      <DataTableToolbar table={table} />
    </DataTable>
  );
}
