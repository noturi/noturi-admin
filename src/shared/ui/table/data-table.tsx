import * as React from 'react';
import { flexRender, type RowData } from '@tanstack/react-table';
import type { DataTableInstance } from './table-features';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../table';
import { getCommonPinningStyles } from './data-table-util';
import { DataTablePagination } from './data-table-pagination';

interface DataTableProps<TData extends RowData> extends React.ComponentProps<'div'> {
  table: DataTableInstance<TData>;
  actionBar?: React.ReactNode;
}

export function DataTable<TData extends RowData>({ table, actionBar, children }: DataTableProps<TData>) {
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
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
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
                <TableCell colSpan={table.getAllColumns().length} className="h-24 text-center">
                  검색 결과가 없습니다.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex flex-col gap-2.5">
        <DataTablePagination table={table} />
        {actionBar && table.getFilteredSelectedRowModel().rows.length > 0 && actionBar}
      </div>
    </div>
  );
}
