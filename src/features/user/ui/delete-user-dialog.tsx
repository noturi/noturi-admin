'use client';

import { ConfirmDialog, ConfirmSummary } from '@/shared/ui/confirm-dialog';
import { executeAction } from '@/shared/lib';

import { deleteUser } from '../api/actions';

interface DeleteUserDialogProps {
  user: { id: string; name: string; email: string; memoCount?: number; categoryCount?: number };
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** 삭제 후 — 상세 화면에서는 목록으로 이동 */
  onDeleted?: () => void;
}

/** 앱 사용자 계정 삭제 — 서버에서 메모·카테고리·캘린더·기기가 함께 지워짐(Cascade) */
export function DeleteUserDialog({ user, open, onOpenChange, onDeleted }: DeleteUserDialogProps) {
  const counts = [
    ...(user.memoCount != null ? [{ label: '메모', value: `${user.memoCount.toLocaleString()}개` }] : []),
    ...(user.categoryCount != null ? [{ label: '카테고리', value: `${user.categoryCount.toLocaleString()}개` }] : []),
  ];

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title={`${user.name} 님의 계정을 삭제할까요?`}
      description="메모·카테고리·캘린더 일정·알림 받을 기기 정보가 함께 지워지고, 되돌릴 수 없어요."
      confirmLabel="계정 삭제"
      variant="destructive"
      onConfirm={async () => {
        const result = await executeAction(() => deleteUser(user.id), {
          successMessage: `${user.name} 님의 계정을 삭제했어요.`,
          errorMessage: '계정을 삭제하지 못했어요. 잠시 후 다시 시도해 주세요.',
        });
        if (result.ok) onDeleted?.();
        return result.ok;
      }}
    >
      <ConfirmSummary items={[{ label: '이메일', value: user.email }, ...counts]} />
    </ConfirmDialog>
  );
}
