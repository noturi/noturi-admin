'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Eye, MoreHorizontal, Trash } from 'lucide-react';

import { User } from '@/entities/user';
import { DeleteUserDialog } from '@/features/user';
import { Button } from '@/shared/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';

interface CellActionProps {
  data: User;
  /** 권한이 없으면 삭제 항목을 숨김 (눌러서 서버 오류를 받게 하지 않음) */
  canDelete: boolean;
}

export const CellAction = ({ data, canDelete }: CellActionProps) => {
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={<Button variant="ghost" size="icon" className="size-8" aria-label={`${data.name} 작업 메뉴`} />}
        >
          <MoreHorizontal />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem render={<Link href={`/dashboard/user/${data.id}`} />}>
            <Eye />
            상세 보기
          </DropdownMenuItem>
          {canDelete && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" onClick={() => setDeleteOpen(true)}>
                <Trash />
                계정 삭제
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {canDelete && <DeleteUserDialog user={data} open={deleteOpen} onOpenChange={setDeleteOpen} />}
    </>
  );
};
