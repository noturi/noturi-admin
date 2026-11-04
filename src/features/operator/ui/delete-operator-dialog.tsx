'use client';

import { ConfirmDialog, ConfirmSummary } from '@/shared/ui/confirm-dialog';
import { executeAction, formatRole } from '@/shared/lib';

import { deleteOperator } from '../api/actions';

interface DeleteOperatorDialogProps {
  operator: { id: string; email: string; name?: string; role: string };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteOperatorDialog({ operator, open, onOpenChange }: DeleteOperatorDialogProps) {
  const name = operator.name || operator.email;
  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title={`운영자 ${name} 계정을 삭제할까요?`}
      description="이 계정으로는 더 이상 어드민에 로그인할 수 없어요. 되돌릴 수 없어요."
      confirmLabel="운영자 삭제"
      variant="destructive"
      onConfirm={async () => {
        const result = await executeAction(() => deleteOperator(operator.id), {
          successMessage: `운영자 ${name} 계정을 삭제했어요.`,
          errorMessage: '운영자를 삭제하지 못했어요. 잠시 후 다시 시도해 주세요.',
        });
        return result.ok;
      }}
    >
      <ConfirmSummary
        items={[
          { label: '이메일', value: operator.email },
          { label: '역할', value: formatRole(operator.role) },
        ]}
      />
    </ConfirmDialog>
  );
}
