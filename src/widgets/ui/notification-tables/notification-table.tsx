'use client';

import { DataTable } from '@/shared/ui/table/data-table';
import { DataTableToolbar } from '@/shared/ui/table/data-table-toolbar';
import { useDataTable } from '@/shared/ui/table/use-data-table';
import { parseAsInteger, useQueryState } from 'nuqs';
import { getNotificationColumns } from './columns';
import { Notification } from '@/entities/notification/model/types';

interface NotificationTableParams {
  data: Notification[];
  pageCount: number;
}

export function NotificationTable({ data, pageCount }: NotificationTableParams) {
  useQueryState('perPage', parseAsInteger.withDefault(10));

  const columns = getNotificationColumns();

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
