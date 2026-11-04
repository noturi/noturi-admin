'use client';

import Link from 'next/link';
import { ColumnDef } from '@tanstack/react-table';
import { Repeat } from 'lucide-react';

import {
  describeNotificationSchedule,
  getNotificationStatus,
  Notification,
  NotificationStatusBadge,
} from '@/entities/notification';
import { NotificationActions } from '@/features/notification';
import { formatKstDateTime } from '@/shared/lib';
import type { DataTableFeatures } from '@/shared/ui/table/table-features';

/**
 * 서버(/notifications)는 정렬을 지원하지 않고 최신 등록순 고정 → 모든 열 정렬 끔
 * 필터는 서버가 받는 isActive·isRepeat만
 */
export function getNotificationColumns(): ColumnDef<DataTableFeatures, Notification>[] {
  return [
    {
      id: 'title',
      accessorKey: 'title',
      header: '알림',
      cell: ({ row }) => (
        <div className="max-w-md min-w-48">
          <Link
            href={`/dashboard/notification/${row.original.id}`}
            className="block truncate font-medium underline-offset-4 hover:underline"
          >
            {row.original.title}
          </Link>
          <p className="truncate text-xs text-muted-foreground">{row.original.body}</p>
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
      meta: { label: '알림' },
    },
    {
      id: 'status',
      header: '상태',
      cell: ({ row }) => <NotificationStatusBadge status={getNotificationStatus(row.original)} />,
      enableSorting: false,
      meta: { label: '상태' },
    },
    {
      id: 'schedule',
      header: '발송 일정',
      cell: ({ row }) => (
        <div className="flex min-w-40 items-center gap-1.5 text-sm tabular-nums">
          {row.original.isRepeat && <Repeat className="size-3.5 shrink-0 text-muted-foreground" aria-label="반복" />}
          <span className="break-keep">{describeNotificationSchedule(row.original)}</span>
        </div>
      ),
      enableSorting: false,
      meta: { label: '발송 일정' },
    },
    {
      id: 'targetUserCount',
      accessorKey: 'targetUserCount',
      header: () => <div className="text-right">받는 사람</div>,
      cell: ({ cell }) => <div className="text-right tabular-nums">{cell.getValue<number>().toLocaleString()}명</div>,
      enableSorting: false,
      meta: { label: '받는 사람' },
    },
    {
      id: 'lastSentAt',
      accessorKey: 'lastSentAt',
      header: '마지막 발송',
      cell: ({ cell }) => {
        const date = cell.getValue<string | undefined>();
        return (
          <div className="min-w-32 text-sm text-muted-foreground tabular-nums">
            {date ? formatKstDateTime(date) : '-'}
          </div>
        );
      },
      enableSorting: false,
      meta: { label: '마지막 발송' },
    },
    // 아래 두 열은 필터 전용(화면에는 숨김) — 서버 쿼리 키(isRepeat·isActive)와 id가 같아야 함
    {
      id: 'isRepeat',
      accessorKey: 'isRepeat',
      header: '종류',
      enableSorting: false,
      enableColumnFilter: true,
      enableHiding: false,
      meta: {
        label: '종류',
        variant: 'select',
        options: [
          { label: '1회', value: 'false' },
          { label: '반복', value: 'true' },
        ],
      },
    },
    {
      id: 'isActive',
      accessorKey: 'isActive',
      header: '켜짐',
      enableSorting: false,
      enableColumnFilter: true,
      enableHiding: false,
      meta: {
        label: '켜짐 여부',
        variant: 'select',
        options: [
          { label: '켜짐', value: 'true' },
          { label: '꺼짐', value: 'false' },
        ],
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => <NotificationActions notification={row.original} variant="menu" />,
      enableHiding: false,
    },
  ];
}
