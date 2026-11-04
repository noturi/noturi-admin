'use client';

import * as React from 'react';
import { Loader2 } from 'lucide-react';

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './alert-dialog';
import { Button } from './button';

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** 무엇을 하는지 대상까지 — 예: "'영화' 카테고리를 지울까요?" */
  title: string;
  /** 결과·되돌릴 수 있는지 — 예: "지우면 되돌릴 수 없어요." */
  description?: React.ReactNode;
  /** 요약(ConfirmSummary 등) */
  children?: React.ReactNode;
  /** 동사로 — "삭제", "지금 보내기" */
  confirmLabel: string;
  variant?: 'default' | 'destructive';
  /** true를 돌려주면 닫힘. 실패하면 열어둬서 다시 시도할 수 있게 */
  onConfirm: () => Promise<boolean>;
}

/**
 * 되돌리기 어려운 작업의 확인창 — 실행하는 동안 열어두고 진행 표시
 * (AlertDialogAction은 누르는 즉시 닫혀 실패해도 알 수 없었음)
 */
export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  confirmLabel,
  variant = 'default',
  onConfirm,
}: ConfirmDialogProps) {
  const [pending, setPending] = React.useState(false);

  const handleConfirm = async () => {
    setPending(true);
    try {
      if (await onConfirm()) onOpenChange(false);
    } finally {
      setPending(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={(next) => !pending && onOpenChange(next)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="break-keep">{title}</AlertDialogTitle>
          {description && <AlertDialogDescription className="break-keep">{description}</AlertDialogDescription>}
        </AlertDialogHeader>
        {children}
        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending}>취소</AlertDialogCancel>
          <Button variant={variant} onClick={handleConfirm} disabled={pending}>
            {pending && <Loader2 className="animate-spin" aria-hidden />}
            {confirmLabel}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

/** 확인창·미리보기에 쓰는 "항목 — 값" 요약 */
export function ConfirmSummary({ items }: { items: { label: string; value: React.ReactNode }[] }) {
  return (
    <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 rounded-md border px-4 py-3 text-sm">
      {items.map((item) => (
        <React.Fragment key={item.label}>
          <dt className="text-muted-foreground">{item.label}</dt>
          <dd className="min-w-0 font-medium break-words">{item.value}</dd>
        </React.Fragment>
      ))}
    </dl>
  );
}
