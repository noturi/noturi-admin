'use client';
import { DataTableColumnHeader } from '@/shared/ui/table/data-table-column-header';

import { Column, ColumnDef } from '@tanstack/react-table';

import { User } from '@/entities/user/model/types';
import { CellAction } from './cell-action';
import { can, type AuthUser } from '@/shared/lib/permissions';

// Helper function to convert null to undefined for avatarUrl
const normalizeUser = (user: Record<string, unknown>): User =>
  ({
    ...user,
    avatarUrl: user.avatarUrl === null ? undefined : user.avatarUrl,
  }) as User;

const CellActionWrapper: React.FC<{ data: User; currentUser: AuthUser }> = ({ data, currentUser }) => {
  if (!currentUser) {
    return null;
  }

  const permissions = can(currentUser);

  const hasAnyPermission = permissions.deleteUser(data) || permissions.updateUser(data);

  if (!hasAnyPermission) return null;

  return <CellAction data={data} />;
};

export const getColumns = (currentUser: AuthUser): ColumnDef<User>[] => [
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
    cell: ({ row }) => <CellActionWrapper data={normalizeUser(row.original)} currentUser={currentUser} />,
    enableHiding: false,
  },
];
