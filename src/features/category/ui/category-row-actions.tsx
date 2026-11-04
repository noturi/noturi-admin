'use client';

import { useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { Edit, MoreHorizontal, Power, PowerOff, Trash } from 'lucide-react';

import type { Category } from '@/entities/category';
import { executeAction, ROUTES } from '@/shared/lib';
import { Button } from '@/shared/ui/button';
import { ConfirmDialog } from '@/shared/ui/confirm-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';

import { deleteCategory, updateCategory } from '../api/actions';

interface CategoryRowActionsProps {
  category: Category;
  /** 켜진 기본 카테고리가 이것 하나뿐인지 — 끄거나 지우면 서버가 하드코딩된 기본 세트(영화·음악·책)를 대신 줌 */
  isLastActive: boolean;
}

const FALLBACK_NOTE = '켜진 기본 카테고리가 하나도 없으면 새 사용자에게는 서버 기본값(영화·음악·책)이 만들어져요.';

/**
 * 기본 카테고리 행 작업 — 바뀌는 건 "앞으로 가입하는 사용자"뿐이라는 걸 문구로 분명히
 * (서버는 가입할 때 켜진 기본 카테고리의 이름·색을 복사함. 이미 가입한 사용자의 카테고리는 그대로)
 */
export function CategoryRowActions({ category, isLastActive }: CategoryRowActionsProps) {
  const [deleteOpen, setDeleteOpen] = useState(false);

  /** 켜기·끄기는 확인 대신 되돌리기 — 기존 사용자에게 영향이 없고 바로 되돌릴 수 있음 */
  const toggle = async () => {
    const next = !category.isActive;
    const result = await executeAction(() => updateCategory(category.id, { isActive: next }), {
      errorMessage: '상태를 바꾸지 못했어요.',
    });
    if (!result.ok) return;
    const message = category.isActive
      ? `"${category.name}" 카테고리를 껐어요. 앞으로 가입하는 사용자에게 만들어지지 않아요.`
      : `"${category.name}" 카테고리를 켰어요. 앞으로 가입하는 사용자에게 만들어져요.`;
    toast.success(category.isActive && isLastActive ? `${message} ${FALLBACK_NOTE}` : message, {
      action: {
        label: '되돌리기',
        onClick: () =>
          // 토글을 다시 부르지 않고 원래 상태를 명시 — 두 번 눌러도, 그사이 누가 바꿔도 결과가 같음
          void executeAction(() => updateCategory(category.id, { isActive: !next }), {
            successMessage: '되돌렸어요.',
            errorMessage: '되돌리지 못했어요.',
          }),
      },
    });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={<Button variant="ghost" size="icon" className="size-8" aria-label={`${category.name} 작업 메뉴`} />}
        >
          <MoreHorizontal />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem render={<Link href={`${ROUTES.DASHBOARD.CATEGORY}/${category.id}/edit`} />}>
            <Edit />
            수정
          </DropdownMenuItem>
          <DropdownMenuItem onClick={toggle}>
            {category.isActive ? <PowerOff /> : <Power />}
            {category.isActive ? '끄기' : '켜기'}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onClick={() => setDeleteOpen(true)}>
            <Trash />
            삭제
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title={`"${category.name}" 기본 카테고리를 삭제할까요?`}
        description={
          <>
            앞으로 가입하는 사용자에게 만들어지지 않아요. 이미 가입한 사용자의 &quot;{category.name}&quot; 카테고리와
            메모는 그대로예요. 잠시 빼 두려면 삭제 대신 끄기를 쓰세요.
            {category.isActive && isLastActive && <span className="mt-1 block">{FALLBACK_NOTE}</span>}
          </>
        }
        confirmLabel="삭제"
        variant="destructive"
        onConfirm={async () => {
          const result = await executeAction(() => deleteCategory(category.id), {
            successMessage: `"${category.name}" 기본 카테고리를 삭제했어요.`,
            errorMessage: '삭제하지 못했어요.',
          });
          return result.ok;
        }}
      />
    </>
  );
}
