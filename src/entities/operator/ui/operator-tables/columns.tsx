'use client';
import { Badge } from '@/shared/ui/badge';
import { DataTableColumnHeader } from '@/shared/ui/table/data-table-column-header';

import { Column, ColumnDef } from '@tanstack/react-table';

import { Operator } from '@/entities/operator/model/types';
import { CellAction } from './cell-action';
import { can, AuthUser } from '@/shared/lib/permissions';

const getRoleDisplay = (role: string) => {
  const roleConfig = {
    SUPER_ADMIN: { label: '슈퍼어드민', className: 'bg-purple-100 text-purple-800 border-purple-200' },
    ADMIN: { label: '어드민', className: 'bg-blue-100 text-blue-800 border-blue-200' },
  };
  return roleConfig[role as keyof typeof roleConfig] || roleConfig.ADMIN;
};

// Helper function to convert null to undefined for avatarUrl
const normalizeOperator = (operator: Operator): Operator =>
  ({
    ...operator,
    avatarUrl: operator.avatarUrl || undefined,
  }) as Operator;

const CellActionWrapper: React.FC<{ data: Operator; currentUser: AuthUser }> = ({ data, currentUser }) => {
  if (!currentUser) return null;

  const permissions = can(currentUser);
  const hasAnyPermission = permissions.deleteOperator(data) || permissions.updateOperator(data);

  if (!hasAnyPermission) return null;

  return <CellAction data={data} />;
};

export function getOperatorColumns(currentUser: AuthUser): ColumnDef<Operator>[] {
  return [
    {
      id: 'email',
      accessorKey: 'email',
      header: ({ column }: { column: Column<Operator, unknown> }) => (
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
      },
    },
    {
      id: 'name',
      accessorKey: 'name',
      header: ({ column }: { column: Column<Operator, unknown> }) => (
        <DataTableColumnHeader column={column} title="이름" />
      ),
      cell: ({ cell }) => {
        const name = cell.getValue<string>();

        return <div className="w-[100px] truncate">{name}</div>;
      },
      enableSorting: true,
      meta: {
        label: 'Name',
      },
    },
    {
      id: 'nickname',
      accessorKey: 'nickname',
      header: ({ column }: { column: Column<Operator, unknown> }) => (
        <DataTableColumnHeader column={column} title="닉네임" />
      ),
      cell: ({ cell }) => {
        const nickname = cell.getValue<string>();

        return <div className="w-[100px] truncate">{nickname}</div>;
      },
      enableSorting: true,
      meta: {
        label: 'Nickname',
      },
    },
    {
      id: 'role',
      accessorKey: 'role',
      header: ({ column }: { column: Column<Operator, unknown> }) => (
        <DataTableColumnHeader column={column} title="역할" />
      ),
      cell: ({ cell }) => {
        const role = cell.getValue<string>();
        const { label, className } = getRoleDisplay(role);

        return (
          <Badge variant="secondary" className={className}>
            {label}
          </Badge>
        );
      },
      enableSorting: true,
      meta: {
        label: 'Role',
        variant: 'multiSelect',
        options: [
          { label: '어드민', value: 'ADMIN' },
          { label: '슈퍼어드민', value: 'SUPER_ADMIN' },
        ],
      },
    },
    {
      id: 'createdAt',
      accessorKey: 'createdAt',
      header: ({ column }: { column: Column<Operator, unknown> }) => (
        <DataTableColumnHeader column={column} title="등록일" />
      ),
      cell: ({ cell }) => {
        const date = cell.getValue<string>();
        const formatted = new Date(date).toLocaleDateString('ko-KR');

        return <div className="w-[100px]">{formatted}</div>;
      },
      enableSorting: true,
      meta: {
        label: 'Created At',
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => <CellActionWrapper data={normalizeOperator(row.original)} currentUser={currentUser} />,
    },
  ];
}
