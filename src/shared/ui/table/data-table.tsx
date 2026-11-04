import * as React from 'react';
import { flexRender, type RowData } from '@tanstack/react-table';
import type { DataTableInstance } from './table-features';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../table';
import { getCommonPinningStyles } from './data-table-util';
import { DataTablePagination } from './data-table-pagination';

interface DataTableProps<TData extends RowData> extends React.ComponentProps<'div'> {
  table: DataTableInstance<TData>;
  actionBar?: React.ReactNode;
  /** 서버 응답의 전체 개수 — 없으면 현재 페이지 행 수로 대신 */
  totalCount?: number;
  /** 빈 상태 문구. 필터가 걸려 있으면 filteredEmptyMessage를 보여줌 */
  emptyMessage?: React.ReactNode;
  filteredEmptyMessage?: React.ReactNode;
}

export function DataTable<TData extends RowData>({
  table,
  actionBar,
  totalCount,
  emptyMessage = '아직 항목이 없어요.',
  filteredEmptyMessage = '조건에 맞는 항목이 없어요. 필터를 바꿔 보세요.',
  children,
}: DataTableProps<TData>) {
  const isFiltered = table.state.columnFilters.length > 0;
  return (
    <div className="w-full space-y-4">
      {children}
      <div className="overflow-x-auto rounded-lg border">
        <Table className="min-w-[640px]">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    style={{
                      ...getCommonPinningStyles({ column: header.column }),
                    }}
                  >
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() ? 'selected' : undefined}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      style={{
                        ...getCommonPinningStyles({ column: cell.column }),
                      }}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={table.getAllColumns().length}
                  className="h-32 text-center break-keep whitespace-normal text-muted-foreground"
                >
                  {isFiltered ? filteredEmptyMessage : emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex flex-col gap-2.5">
        <DataTablePagination table={table} totalCount={totalCount} />
        {actionBar && table.getFilteredSelectedRowModel().rows.length > 0 && actionBar}
      </div>
    </div>
  );
}
