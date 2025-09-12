'use client';
import { Badge } from '@/shared/ui/badge';
import { DataTableColumnHeader } from '@/shared/ui/table/data-table-column-header';

import { Column, ColumnDef } from '@tanstack/react-table';
import { Mail, Calendar, Shield } from 'lucide-react';

import { User } from '@/entities/user/model/types';

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'avatarUrl',
    header: 'AVATAR',
    cell: ({ row }) => {
      const avatarUrl = row.getValue('avatarUrl') as string;
      const name = row.getValue('name') as string;

      return (
        <div className="relative h-8 w-8">
          {/* <Image src={avatarUrl || '/default-avatar.png'} alt={name} fill className="rounded-full object-cover" /> */}
        </div>
      );
    },
  },
  {
    id: 'name',
    accessorKey: 'name',
    header: ({ column }: { column: Column<User, unknown> }) => <DataTableColumnHeader column={column} title="Name" />,
    cell: ({ cell }) => <div className="font-medium">{cell.getValue<string>()}</div>,
    enableColumnFilter: true,
  },
  {
    id: 'nickname',
    accessorKey: 'nickname',
    header: ({ column }: { column: Column<User, unknown> }) => (
      <DataTableColumnHeader column={column} title="Nickname" />
    ),
    cell: ({ cell }) => <div className="text-muted-foreground">@{cell.getValue<string>()}</div>,
  },
  {
    id: 'email',
    accessorKey: 'email',
    header: ({ column }: { column: Column<User, unknown> }) => <DataTableColumnHeader column={column} title="Email" />,
    cell: ({ cell }) => (
      <div className="flex items-center gap-2">
        <Mail className="text-muted-foreground h-4 w-4" />
        {cell.getValue<string>()}
      </div>
    ),
    enableColumnFilter: true,
  },
  {
    id: 'role',
    accessorKey: 'role',
    header: ({ column }: { column: Column<User, unknown> }) => <DataTableColumnHeader column={column} title="Role" />,
    cell: ({ cell }) => {
      const role = cell.getValue<string>();

      return (
        <Badge variant={role === 'ADMIN' ? 'destructive' : 'secondary'} className="capitalize">
          <Shield className="mr-1 h-3 w-3" />
          {role.toLowerCase()}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'memoCount',
    header: 'MEMOS',
    cell: ({ cell }) => <div className="text-center font-mono">{cell.getValue<number>()}</div>,
  },
  {
    accessorKey: 'categoryCount',
    header: 'CATEGORIES',
    cell: ({ cell }) => <div className="text-center font-mono">{cell.getValue<number>()}</div>,
  },
  {
    id: 'createdAt',
    accessorKey: 'createdAt',
    header: ({ column }: { column: Column<User, unknown> }) => (
      <DataTableColumnHeader column={column} title="Created" />
    ),
    cell: ({ cell }) => {
      const date = new Date(cell.getValue<string>());
      return (
        <div className="flex items-center gap-2">
          <Calendar className="text-muted-foreground h-4 w-4" />
          {date.toLocaleDateString()}
        </div>
      );
    },
  },
];
