'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash } from 'lucide-react';

import { ROUTES } from '@/shared/lib';
import { Button } from '@/shared/ui/button';

import { DeleteUserDialog } from './delete-user-dialog';

/** 사용자 상세 머리글의 삭제 버튼 — 지우면 목록으로 */
export function DeleteUserButton({ user }: { user: Parameters<typeof DeleteUserDialog>[0]['user'] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="ghost" className="text-destructive hover:text-destructive" onClick={() => setOpen(true)}>
        <Trash />
        계정 삭제
      </Button>
      <DeleteUserDialog
        user={user}
        open={open}
        onOpenChange={setOpen}
        onDeleted={() => router.push(ROUTES.DASHBOARD.USER)}
      />
    </>
  );
}
