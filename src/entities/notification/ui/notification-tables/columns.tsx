'use client';

import Link from 'next/link';
import { Badge } from '@/shared/ui/badge';
import { DataTableColumnHeader } from '@/shared/ui/table/data-table-column-header';
import { Column, ColumnDef } from '@tanstack/react-table';
import { Notification, formatRepeatDays } from '@/entities/notification/model/types';
import { CellAction } from './cell-action';
import { Bell, Clock, Repeat } from 'lucide-react';

export function getNotificationColumns(): ColumnDef<Notification>[] {
  return [
    {
      id: 'title',
      accessorKey: 'title',
      header: ({ column }: { column: Column<Notification, unknown> }) => (
        <DataTableColumnHeader column={column} title="제목" />
      ),
      cell: ({ cell, row }) => {
        const title = cell.getValue<string>();
        const id = row.original.id;
        return (
          <div className="flex items-center gap-2">
            <Bell className="text-muted-foreground h-4 w-4" />
            <Link
              href={`/dashboard/notification/${id}`}
              className="text-primary w-[200px] truncate font-medium hover:underline"
            >
              {title}
            </Link>
          </div>
        );
      },
      enableSorting: true,
      enableHiding: false,
      meta: {
        label: 'Title',
      },
    },
    {
      id: 'body',
      accessorKey: 'body',
      header: ({ column }: { column: Column<Notification, unknown> }) => (
        <DataTableColumnHeader column={column} title="내용" />
      ),
      cell: ({ cell }) => {
        const body = cell.getValue<string>();
        return <div className="text-muted-foreground max-w-[250px] truncate text-sm">{body}</div>;
      },
      enableSorting: false,
      meta: {
        label: 'Body',
      },
    },
    {
      id: 'targetUserCount',
      accessorKey: 'targetUserCount',
      header: ({ column }: { column: Column<Notification, unknown> }) => (
        <DataTableColumnHeader column={column} title="대상자" />
      ),
      cell: ({ cell }) => {
        const count = cell.getValue<number>();
        return <div className="text-center font-mono">{count.toLocaleString()}명</div>;
      },
      enableSorting: true,
      meta: {
        label: 'Target Users',
      },
    },
    {
      id: 'scheduledAt',
      accessorKey: 'scheduledAt',
      header: ({ column }: { column: Column<Notification, unknown> }) => (
        <DataTableColumnHeader column={column} title="예약 시간" />
      ),
      cell: ({ row }) => {
        const scheduledAt = row.original.scheduledAt;
        const scheduledTime = row.original.scheduledTime;

        if (!scheduledAt && !scheduledTime) {
          return <Badge variant="outline">즉시 발송</Badge>;
        }

        if (scheduledAt) {
          return (
            <div className="flex items-center gap-1 text-sm">
              <Clock className="h-3 w-3" />
              {new Date(scheduledAt).toLocaleString('ko-KR')}
            </div>
          );
        }

        return (
          <div className="flex items-center gap-1 text-sm">
            <Clock className="h-3 w-3" />
            {scheduledTime}
          </div>
        );
      },
      enableSorting: true,
      meta: {
        label: 'Scheduled At',
      },
    },
    {
      id: 'isRepeat',
      accessorKey: 'isRepeat',
      header: ({ column }: { column: Column<Notification, unknown> }) => (
        <DataTableColumnHeader column={column} title="반복" />
      ),
      cell: ({ row }) => {
        const isRepeat = row.original.isRepeat;
        const repeatDays = row.original.repeatDays;

        if (!isRepeat) {
          return <Badge variant="outline">1회</Badge>;
        }

        return (
          <div className="flex items-center gap-1">
            <Repeat className="h-3 w-3 text-blue-500" />
            <Badge variant="secondary">{formatRepeatDays(repeatDays)}</Badge>
          </div>
        );
      },
      enableSorting: true,
      meta: {
        label: 'Repeat',
      },
    },
    {
      id: 'isActive',
      accessorKey: 'isActive',
      header: ({ column }: { column: Column<Notification, unknown> }) => (
        <DataTableColumnHeader column={column} title="상태" />
      ),
      cell: ({ cell }) => {
        const isActive = cell.getValue<boolean>();
        return <Badge variant={isActive ? 'default' : 'secondary'}>{isActive ? '활성' : '비활성'}</Badge>;
      },
      enableSorting: true,
      enableColumnFilter: true,
      meta: {
        label: 'Status',
        variant: 'multiSelect',
        options: [
          { label: '활성', value: 'true' },
          { label: '비활성', value: 'false' },
        ],
      },
    },
    {
      id: 'lastSentAt',
      accessorKey: 'lastSentAt',
      header: ({ column }: { column: Column<Notification, unknown> }) => (
        <DataTableColumnHeader column={column} title="마지막 발송" />
      ),
      cell: ({ cell }) => {
        const date = cell.getValue<string | undefined>();
        if (!date) return <span className="text-muted-foreground">-</span>;
        return <div className="w-[120px] text-sm">{new Date(date).toLocaleString('ko-KR')}</div>;
      },
      enableSorting: true,
      meta: {
        label: 'Last Sent At',
      },
    },
    {
      id: 'createdAt',
      accessorKey: 'createdAt',
      header: ({ column }: { column: Column<Notification, unknown> }) => (
        <DataTableColumnHeader column={column} title="등록일" />
      ),
      cell: ({ cell }) => {
        const date = cell.getValue<string>();
        return <div className="w-[100px]">{new Date(date).toLocaleDateString('ko-KR')}</div>;
      },
      enableSorting: true,
      meta: {
        label: 'Created At',
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => <CellAction data={row.original} />,
    },
  ];
}
