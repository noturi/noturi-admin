'use client';

import Link from 'next/link';
import { ColumnDef } from '@tanstack/react-table';

import { AUDIT_ACTION_LABEL, RISKY_AUDIT_ACTIONS, type AuditLog } from '@/entities/audit-log';
import { formatKstDateTime, ROUTES } from '@/shared/lib';
import { Badge } from '@/shared/ui/badge';
import { DataTable } from '@/shared/ui/table/data-table';
import { DataTableToolbar } from '@/shared/ui/table/data-table-toolbar';
import type { DataTableFeatures } from '@/shared/ui/table/table-features';
import { useDataTable } from '@/shared/ui/table/use-data-table';

/** 아직 있을 수 있는 대상만 링크 — 삭제 기록의 대상은 이미 없음 */
function targetHref(log: AuditLog): string | null {
  if (!log.targetId || log.action.endsWith('.delete')) return null;
  if (log.targetType === 'notification') return `${ROUTES.DASHBOARD.NOTIFICATION}/${log.targetId}`;
  if (log.targetType === 'category') return `${ROUTES.DASHBOARD.CATEGORY}/${log.targetId}/edit`;
  if (log.targetType === 'app-version') return ROUTES.DASHBOARD.APP_VERSION;
  return null;
}

const columns: ColumnDef<DataTableFeatures, AuditLog>[] = [
  {
    id: 'createdAt',
    accessorKey: 'createdAt',
    header: '언제',
    cell: ({ cell }) => <div className="min-w-32 tabular-nums">{formatKstDateTime(cell.getValue<string>())}</div>,
    enableSorting: false,
    enableHiding: false,
    meta: { label: '언제' },
  },
  {
    id: 'actorEmail',
    accessorKey: 'actorEmail',
    header: '누가',
    cell: ({ cell }) => <div className="max-w-56 truncate">{cell.getValue<string>()}</div>,
    enableSorting: false,
    meta: { label: '누가' },
  },
  {
    // id가 서버 쿼리 키(action)와 같아야 필터가 서버로 감
    id: 'action',
    accessorKey: 'action',
    header: '무엇을',
    cell: ({ cell }) => {
      const action = cell.getValue<string>();
      return (
        <Badge variant={RISKY_AUDIT_ACTIONS.includes(action) ? 'secondary' : 'outline'}>
          {AUDIT_ACTION_LABEL[action as keyof typeof AUDIT_ACTION_LABEL] ?? action}
        </Badge>
      );
    },
    enableSorting: false,
    enableColumnFilter: true,
    meta: {
      label: '작업',
      variant: 'select',
      options: Object.entries(AUDIT_ACTION_LABEL).map(([value, label]) => ({ value, label })),
    },
  },
  {
    id: 'summary',
    accessorKey: 'summary',
    header: '내용',
    cell: ({ row }) => {
      const href = targetHref(row.original);
      return (
        <div className="max-w-xl min-w-56 break-keep">
          {href ? (
            <Link href={href} className="underline-offset-4 hover:underline">
              {row.original.summary}
            </Link>
          ) : (
            row.original.summary
          )}
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
    meta: { label: '내용' },
  },
];

export function AuditLogTable({
  data,
  pageCount,
  totalCount,
}: {
  data: AuditLog[];
  pageCount: number;
  totalCount?: number;
}) {
  const { table } = useDataTable({ data, columns, pageCount, shallow: false, debounceMs: 300 });
  return (
    <DataTable
      table={table}
      totalCount={totalCount}
      emptyMessage="아직 기록이 없어요. 이 기능을 켠 뒤의 작업부터 남아요."
      filteredEmptyMessage="이 작업의 기록이 없어요."
    >
      <DataTableToolbar table={table} />
    </DataTable>
  );
}
