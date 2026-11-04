'use client';

import { useState } from 'react';
import { MoreHorizontal, Trash } from 'lucide-react';

import { Operator } from '@/entities/operator';
import { DeleteOperatorDialog } from '@/features/operator';
import { Button } from '@/shared/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/shared/ui/dropdown-menu';

export const CellAction = ({ data }: { data: Operator }) => {
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              size="icon"
              className="size-8"
              aria-label={`${data.name || data.email} 작업 메뉴`}
            />
          }
        >
          <MoreHorizontal />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem variant="destructive" onClick={() => setDeleteOpen(true)}>
            <Trash />
            운영자 삭제
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DeleteOperatorDialog operator={data} open={deleteOpen} onOpenChange={setDeleteOpen} />
    </>
  );
};
