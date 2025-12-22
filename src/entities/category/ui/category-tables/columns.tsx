'use client';
import { Badge } from '@/shared/ui/badge';
import { DataTableColumnHeader } from '@/shared/ui/table/data-table-column-header';

import { Column, ColumnDef } from '@tanstack/react-table';

import { Category } from '@/entities/category/model/types';
import { CellAction } from './cell-action';

export function getCategoryColumns(): ColumnDef<Category>[] {
  return [
    {
      id: 'name',
      accessorKey: 'name',
      header: ({ column }: { column: Column<Category, unknown> }) => (
        <DataTableColumnHeader column={column} title="카테고리명" />
      ),
      cell: ({ cell }) => {
        const name = cell.getValue<string>();
        return <div className="w-[150px] truncate font-medium">{name}</div>;
      },
      enableSorting: true,
      enableHiding: false,
      meta: {
        label: 'Name',
      },
    },
    {
      id: 'color',
      accessorKey: 'color',
      header: ({ column }: { column: Column<Category, unknown> }) => (
        <DataTableColumnHeader column={column} title="색상" />
      ),
      cell: ({ cell }) => {
        const color = cell.getValue<string>();
        return (
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-full border" style={{ backgroundColor: color }} />
            <span className="text-muted-foreground text-sm">{color}</span>
          </div>
        );
      },
      enableSorting: true,
      meta: {
        label: 'Color',
      },
    },
    {
      id: 'description',
      accessorKey: 'description',
      header: ({ column }: { column: Column<Category, unknown> }) => (
        <DataTableColumnHeader column={column} title="설명" />
      ),
      cell: ({ cell }) => {
        const description = cell.getValue<string | null>();
        return <div className="text-muted-foreground max-w-[300px] truncate text-sm">{description || '-'}</div>;
      },
      enableSorting: false,
      meta: {
        label: 'Description',
      },
    },
    {
      id: 'sortOrder',
      accessorKey: 'sortOrder',
      header: ({ column }: { column: Column<Category, unknown> }) => (
        <DataTableColumnHeader column={column} title="정렬 순서" />
      ),
      cell: ({ cell }) => {
        const sortOrder = cell.getValue<number>();
        return <div className="text-center font-mono">{sortOrder}</div>;
      },
      enableSorting: true,
      meta: {
        label: 'Sort Order',
        variant: 'number',
        placeholder: 'Filter by sort order...',
      },
    },
    {
      id: 'isActive',
      accessorKey: 'isActive',
      header: ({ column }: { column: Column<Category, unknown> }) => (
        <DataTableColumnHeader column={column} title="상태" />
      ),
      cell: ({ cell }) => {
        const isActive = cell.getValue<boolean>();
        return <Badge variant={isActive ? 'default' : 'secondary'}>{isActive ? '활성' : '비활성'}</Badge>;
      },
      enableSorting: true,
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
      id: 'createdAt',
      accessorKey: 'createdAt',
      header: ({ column }: { column: Column<Category, unknown> }) => (
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
      cell: ({ row }) => <CellAction data={row.original} />,
    },
  ];
}
