'use client';

import Link from 'next/link';
import { Column, ColumnDef } from '@tanstack/react-table';

import { User } from '@/entities/user';
import { can, type AuthUser } from '@/shared/lib/permissions';
import { formatKstDate } from '@/shared/lib';
import { DataTableColumnHeader } from '@/shared/ui/table/data-table-column-header';
import type { DataTableFeatures } from '@/shared/ui/table/table-features';

import { CellAction } from './cell-action';

type UserColumn = Column<DataTableFeatures, User, unknown>;

/** 값이 없으면 "-" — 빈 칸은 "0"인지 "모름"인지 구분이 안 됨 */
const CountCell = ({ value }: { value: number | undefined }) => (
  <div className="text-right tabular-nums">{value == null ? '-' : value.toLocaleString()}</div>
);

export function getUserColumns(currentUser: AuthUser): ColumnDef<DataTableFeatures, User>[] {
  const permissions = can(currentUser);

  return [
    {
      id: 'email',
      accessorKey: 'email',
      header: ({ column }: { column: UserColumn }) => <DataTableColumnHeader column={column} title="이메일" />,
      cell: ({ row }) => (
        <Link
          href={`/dashboard/user/${row.original.id}`}
          className="block max-w-64 min-w-40 truncate font-medium underline-offset-4 hover:underline"
        >
          {row.original.email}
        </Link>
      ),
      enableHiding: false,
      enableColumnFilter: true,
      meta: { label: '이메일', variant: 'text', placeholder: '이메일로 찾기' },
    },
    {
      id: 'name',
      accessorKey: 'name',
      header: ({ column }: { column: UserColumn }) => <DataTableColumnHeader column={column} title="이름" />,
      cell: ({ cell }) => <div className="max-w-40 min-w-20 truncate">{cell.getValue<string>()}</div>,
      meta: { label: '이름' },
    },
    {
      id: 'nickname',
      accessorKey: 'nickname',
      header: ({ column }: { column: UserColumn }) => <DataTableColumnHeader column={column} title="닉네임" />,
      cell: ({ cell }) => (
        <div className="max-w-40 min-w-20 truncate text-muted-foreground">@{cell.getValue<string>()}</div>
      ),
      meta: { label: '닉네임' },
    },
    {
      id: 'memoCount',
      accessorKey: 'memoCount',
      header: () => <div className="text-right">메모</div>,
      cell: ({ cell }) => <CountCell value={cell.getValue<number | undefined>()} />,
      enableSorting: false,
      meta: { label: '메모 수' },
    },
    {
      id: 'categoryCount',
      accessorKey: 'categoryCount',
      header: () => <div className="text-right">카테고리</div>,
      cell: ({ cell }) => <CountCell value={cell.getValue<number | undefined>()} />,
      enableSorting: false,
      meta: { label: '카테고리 수' },
    },
    {
      id: 'createdAt',
      accessorKey: 'createdAt',
      header: ({ column }: { column: UserColumn }) => <DataTableColumnHeader column={column} title="가입일" />,
      cell: ({ cell }) => <div className="min-w-24 tabular-nums">{formatKstDate(cell.getValue<string>())}</div>,
      enableColumnFilter: true,
      meta: { label: '가입일', variant: 'dateRange' },
    },
    {
      id: 'actions',
      cell: ({ row }) => <CellAction data={row.original} canDelete={permissions.deleteUser(row.original)} />,
      enableHiding: false,
    },
  ];
}
