'use client';

import type { RowData } from '@tanstack/react-table';
import { Settings2 } from 'lucide-react';

import { Button } from '@/shared/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/shared/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover';
import { cn } from '@/shared/lib';
import { CheckIcon, ChevronDownIcon } from 'lucide-react';
import { useMemo } from 'react';
import type { DataTableInstance } from './table-features';

interface DataTableViewOptionsProps<TData extends RowData> {
  table: DataTableInstance<TData>;
}

export function DataTableViewOptions<TData extends RowData>({ table }: DataTableViewOptionsProps<TData>) {
  const columns = useMemo(
    () => table.getAllColumns().filter((column) => typeof column.accessorFn !== 'undefined' && column.getCanHide()),
    [table]
  );

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button aria-label="표시할 열 고르기" variant="outline" size="sm" className="ml-auto hidden h-8 lg:flex" />
        }
      >
        <Settings2 />
        열 설정
        <ChevronDownIcon className="ml-auto opacity-50" />
      </PopoverTrigger>
      <PopoverContent align="end" className="w-44 p-0">
        <Command>
          <CommandInput placeholder="열 이름으로 찾기" />
          <CommandList>
            <CommandEmpty>맞는 열이 없어요</CommandEmpty>
            <CommandGroup>
              {columns.map((column) => (
                <CommandItem key={column.id} onSelect={() => column.toggleVisibility(!column.getIsVisible())}>
                  <span className="truncate">{column.columnDef.meta?.label ?? column.id}</span>
                  <CheckIcon
                    className={cn('ml-auto size-4 shrink-0', column.getIsVisible() ? 'opacity-100' : 'opacity-0')}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
