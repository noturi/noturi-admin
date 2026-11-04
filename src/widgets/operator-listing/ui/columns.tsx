'use client';

import { Column, ColumnDef } from '@tanstack/react-table';

import { Operator } from '@/entities/operator';
import { formatKstDate, ROLE_LABELS } from '@/shared/lib';
import { can, type AuthUser } from '@/shared/lib/permissions';
import { Badge } from '@/shared/ui/badge';
import { RoleBadge } from '@/shared/ui/role-badge';
import { DataTableColumnHeader } from '@/shared/ui/table/data-table-column-header';
import type { DataTableFeatures } from '@/shared/ui/table/table-features';

import { CellAction } from './cell-action';

type OperatorColumn = Column<DataTableFeatures, Operator, unknown>;

export function getOperatorColumns(currentUser: AuthUser): ColumnDef<DataTableFeatures, Operator>[] {
  const permissions = can(currentUser);

  return [
    {
      id: 'email',
      accessorKey: 'email',
      header: ({ column }: { column: OperatorColumn }) => <DataTableColumnHeader column={column} title="이메일" />,
      cell: ({ row }) => (
        <div className="flex min-w-40 items-center gap-2">
          <span className="max-w-64 truncate font-medium">{row.original.email}</span>
          {row.original.id === currentUser.id && <Badge variant="outline">나</Badge>}
        </div>
      ),
      enableHiding: false,
      enableColumnFilter: true,
      meta: { label: '이메일', variant: 'text', placeholder: '이메일로 찾기' },
    },
    {
      id: 'name',
      accessorKey: 'name',
      header: ({ column }: { column: OperatorColumn }) => <DataTableColumnHeader column={column} title="이름" />,
      cell: ({ cell }) => <div className="max-w-40 min-w-20 truncate">{cell.getValue<string>() || '-'}</div>,
      meta: { label: '이름' },
    },
    {
      id: 'role',
      accessorKey: 'role',
      header: ({ column }: { column: OperatorColumn }) => <DataTableColumnHeader column={column} title="역할" />,
      cell: ({ cell }) => <RoleBadge role={cell.getValue<string>()} />,
      enableColumnFilter: true,
      meta: {
        label: '역할',
        variant: 'multiSelect',
        options: [
          { label: ROLE_LABELS.ADMIN, value: 'ADMIN' },
          { label: ROLE_LABELS.SUPER_ADMIN, value: 'SUPER_ADMIN' },
        ],
      },
    },
    {
      id: 'createdAt',
      accessorKey: 'createdAt',
      header: ({ column }: { column: OperatorColumn }) => <DataTableColumnHeader column={column} title="등록일" />,
      cell: ({ cell }) => <div className="min-w-24 tabular-nums">{formatKstDate(cell.getValue<string>())}</div>,
      meta: { label: '등록일' },
    },
    {
      id: 'actions',
      cell: ({ row }) =>
        // 수정 화면이 아직 없어 메뉴는 삭제뿐 — 권한이 없으면 메뉴 자체를 숨김
        permissions.deleteOperator(row.original) ? <CellAction data={row.original} /> : null,
      enableHiding: false,
    },
  ];
}
