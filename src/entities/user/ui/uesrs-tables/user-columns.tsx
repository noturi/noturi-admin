'use client';
import { DataTableColumnHeader } from '@/shared/ui/table/data-table-column-header';

import { Column, ColumnDef } from '@tanstack/react-table';

import { User } from '@/entities/user/model/types';
import { CellAction } from './cell-action';
import { can, AuthUser } from '@/shared/lib/permissions';

const normalizeUser = (user: Record<string, unknown>): User =>
  ({
    ...user,
    avatarUrl: user.avatarUrl || undefined,
  }) as User;

const CellActionWrapper: React.FC<{ data: User; currentUser: AuthUser }> = ({ data, currentUser }) => {
  if (!currentUser) return null;

  const permissions = can(currentUser);
  const hasAnyPermission = permissions.deleteUser(data) || permissions.updateUser(data);

  if (!hasAnyPermission) return null;

  return <CellAction data={data} />;
};

export function getUserColumns(currentUser: AuthUser): ColumnDef<User>[] {
  return [
    {
      id: 'email',
      accessorKey: 'email',
      header: ({ column }: { column: Column<User, unknown> }) => (
        <DataTableColumnHeader column={column} title="이메일" />
      ),
      cell: ({ cell }) => {
        const email = cell.getValue<string>();

        return <div className="w-[150px] truncate font-medium">{email}</div>;
      },
      enableSorting: true,
      enableHiding: false,
      meta: {
        label: 'Email',
        variant: 'text',
        placeholder: '이메일을 검색하세요.',
      },
    },
    {
      id: 'name',
      accessorKey: 'name',
      header: ({ column }: { column: Column<User, unknown> }) => <DataTableColumnHeader column={column} title="이름" />,
      cell: ({ cell }) => {
        const name = cell.getValue<string>();

        return <div className="w-[100px] truncate">{name}</div>;
      },
      meta: {
        label: 'Name',
      },
    },
    {
      id: 'nickname',
      accessorKey: 'nickname',
      header: ({ column }: { column: Column<User, unknown> }) => (
        <DataTableColumnHeader column={column} title="닉네임" />
      ),
      cell: ({ cell }) => {
        const nickname = cell.getValue<string>();

        return <div className="w-[100px] truncate">{nickname}</div>;
      },
      meta: {
        label: 'Nickname',
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
      header: ({ column }: { column: Column<User, unknown> }) => (
        <DataTableColumnHeader column={column} title="등록일" />
      ),
      cell: ({ cell }) => {
        const date = cell.getValue<string>();
        const formatted = new Date(date).toLocaleDateString('ko-KR');

        return <div className="w-[100px]">{formatted}</div>;
      },
      meta: {
        label: 'Created At',
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => <CellActionWrapper data={normalizeUser(row.original)} currentUser={currentUser} />,
    },
  ];
}
