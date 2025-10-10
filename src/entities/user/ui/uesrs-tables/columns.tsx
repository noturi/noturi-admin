'use client';
import { Badge } from '@/shared/ui/badge';
import { DataTableColumnHeader } from '@/shared/ui/table/data-table-column-header';

import { Column, ColumnDef } from '@tanstack/react-table';
import { Shield } from 'lucide-react';

import { User } from '@/entities/user/model/types';
import { CellAction } from './cell-action';

// Helper function to convert null to undefined for avatarUrl
const normalizeUser = (user: Record<string, unknown>): User =>
  ({
    ...user,
    avatarUrl: user.avatarUrl === null ? undefined : user.avatarUrl,
  }) as User;

export const columns: ColumnDef<User>[] = [
  {
    id: 'name',
    accessorKey: 'name',
    header: ({ column }: { column: Column<User, unknown> }) => <DataTableColumnHeader column={column} title="이름" />,
    cell: ({ cell }) => <div className="font-medium">{cell.getValue<string>()}</div>,
    enableHiding: false,
  },
  {
    id: 'nickname',
    accessorKey: 'nickname',
    header: ({ column }: { column: Column<User, unknown> }) => <DataTableColumnHeader column={column} title="닉네임" />,
    cell: ({ cell }) => <div className="text-muted-foreground">{cell.getValue<string>()}</div>,
  },
  {
    id: 'email',
    accessorKey: 'email',
    header: ({ column }: { column: Column<User, unknown> }) => <DataTableColumnHeader column={column} title="이메일" />,
    cell: ({ cell }) => <div>{cell.getValue<string>()}</div>,
    enableColumnFilter: true,
    enableHiding: false,
    meta: {
      label: 'Email',
      variant: 'text',
      placeholder: '이메일을 검색하세요.',
    },
  },
  {
    id: 'role',
    accessorKey: 'role',
    header: ({ column }: { column: Column<User, unknown> }) => <DataTableColumnHeader column={column} title="역할" />,
    cell: ({ cell }) => {
      const role = cell.getValue<string>();

      return (
        <Badge variant={role === 'ADMIN' ? 'destructive' : 'secondary'} className="capitalize">
          <Shield className="mr-1 h-3 w-3" />
          {role.toLowerCase()}
        </Badge>
      );
    },
    meta: {
      label: 'Role',
      variant: 'multiSelect',
      options: [
        { label: 'Admin', value: 'ADMIN' },
        { label: 'User', value: 'USER' },
      ],
    },
  },
  {
    accessorKey: 'memoCount',
    header: '평가 메모 수',
    cell: ({ cell }) => <div className="text-center font-mono">{cell.getValue<number>()}</div>,

    meta: {
      label: 'Memo Count',
      variant: 'number',
      placeholder: 'Filter by count...',
    },
  },
  {
    accessorKey: 'categoryCount',
    header: '카테고리 수',
    cell: ({ cell }) => <div className="text-center font-mono">{cell.getValue<number>()}</div>,
    meta: {
      label: 'Category Count',
      variant: 'number',
      placeholder: 'Filter by count...',
    },
  },
  {
    id: 'createdAt',
    accessorKey: 'createdAt',
    header: ({ column }: { column: Column<User, unknown> }) => <DataTableColumnHeader column={column} title="생성일" />,
    cell: ({ cell }) => {
      const date = new Date(cell.getValue<string>());
      return <div className="flex items-center gap-2">{date.toLocaleDateString()}</div>;
    },
    enableColumnFilter: true,
    meta: {
      label: 'Created Date',
      variant: 'dateRange',
    },
  },
  {
    id: 'actions',
    header: '작업',
    cell: ({ row }) => <CellAction data={normalizeUser(row.original)} />,
    enableHiding: false,
  },
];
