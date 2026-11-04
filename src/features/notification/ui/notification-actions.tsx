'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Edit, Eye, MoreHorizontal, Power, PowerOff, Send, Trash } from 'lucide-react';

import {
  describeNotificationDestination,
  describeNotificationSchedule,
  getNotificationCapabilities,
  getNotificationStatus,
  type Notification,
} from '@/entities/notification';
import { executeAction, formatKstLong, ROUTES } from '@/shared/lib';
import { Button } from '@/shared/ui/button';
import { ConfirmDialog, ConfirmSummary } from '@/shared/ui/confirm-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';

import { deleteNotification, sendNotification, updateNotification } from '../api/actions';

type DialogKind = 'send' | 'turnOn' | 'delete' | null;

interface NotificationActionsProps {
  notification: Notification;
  /** menu: 목록 행의 ⋯ 메뉴 / buttons: 상세 화면 머리글 버튼 */
  variant: 'menu' | 'buttons';
}

/**
 * 알림 작업(지금 보내기·켜기·끄기·수정·삭제) — 목록과 상세가 같은 규칙·같은 확인 문구를 쓰도록 한곳에
 * 할 수 있는 작업은 실제 상태(getNotificationStatus)로 정함: 이미 보낸 1회 알림은 수정·켜기가 의미 없어 숨김
 */
export function NotificationActions({ notification: n, variant }: NotificationActionsProps) {
  const router = useRouter();
  const [dialog, setDialog] = useState<DialogKind>(null);
  const status = getNotificationStatus(n);
  const { canEdit, canTurnOn, canTurnOff } = getNotificationCapabilities(status);
  const detailHref = `${ROUTES.DASHBOARD.NOTIFICATION}/${n.id}`;
  const people = `${n.targetUserCount.toLocaleString()}명`;

  const summary = (
    <ConfirmSummary
      items={[
        { label: '제목', value: n.title },
        { label: '받는 사람', value: people },
        { label: n.isRepeat ? '반복' : '예약', value: describeNotificationSchedule(n) },
        { label: '누르면', value: describeNotificationDestination(n.data) },
      ]}
    />
  );

  /** 끄기는 확인 대신 되돌리기 — 끄는 쪽은 아무것도 나가지 않아 안전하고, 실수면 바로 되돌릴 수 있게 */
  const turnOff = async () => {
    const result = await executeAction(() => updateNotification(n.id, { isActive: false }), {
      errorMessage: '알림을 끄지 못했어요.',
    });
    if (!result.ok) return;
    toast.success(`"${n.title}" 알림을 껐어요. 켜기 전까지 발송되지 않아요.`, {
      action: {
        label: '되돌리기',
        onClick: () =>
          void executeAction(() => updateNotification(n.id, { isActive: true }), {
            successMessage: '다시 켰어요.',
            errorMessage: '다시 켜지 못했어요. 상세 화면에서 켜 주세요.',
          }),
      },
    });
  };

  const sendWarning =
    status === 'sent' && n.lastSentAt
      ? `이미 ${formatKstLong(n.lastSentAt)}에 보낸 알림이에요. 같은 알림이 한 번 더 나가요.`
      : status === 'scheduled'
        ? `지금 보내면 예약해 둔 ${describeNotificationSchedule(n)} 발송은 취소돼요. 한 번만 나가요.`
        : n.isRepeat
          ? '정해진 반복과 별개로 지금 한 번 나가요. 오늘 반복 발송이 남아 있었다면 오늘은 다시 나가지 않아요.'
          : null;

  const dialogs = (
    <>
      <ConfirmDialog
        open={dialog === 'send'}
        onOpenChange={(open) => setDialog(open ? 'send' : null)}
        title={`지금 ${people}에게 보낼까요?`}
        description={
          <>
            {sendWarning && <span className="mb-1 block font-medium text-foreground">{sendWarning}</span>}
            보내면 취소할 수 없어요.
          </>
        }
        confirmLabel={`${people}에게 보내기`}
        variant="destructive"
        onConfirm={async () => {
          const result = await executeAction(() => sendNotification(n.id), {
            errorMessage: '보내지 못했어요. 잠시 후 다시 시도해 주세요.',
          });
          if (!result.ok) return false;
          const { successCount, failCount } = result.data;
          if (failCount > 0) {
            toast.warning(
              `${successCount.toLocaleString()}명에게 보냈고 ${failCount.toLocaleString()}건은 실패했어요.`
            );
          } else {
            toast.success(`${successCount.toLocaleString()}명에게 보냈어요.`);
          }
          return true;
        }}
      >
        {summary}
      </ConfirmDialog>

      <ConfirmDialog
        open={dialog === 'turnOn'}
        onOpenChange={(open) => setDialog(open ? 'turnOn' : null)}
        title="알림을 다시 켤까요?"
        description={
          n.isRepeat
            ? `켜면 반복 일정(${describeNotificationSchedule(n)})대로 ${people}에게 다시 나가요.`
            : `켜면 ${people}에게 ${describeNotificationSchedule(n)}에 나가요.`
        }
        confirmLabel="켜기"
        onConfirm={async () => {
          const result = await executeAction(() => updateNotification(n.id, { isActive: true }), {
            successMessage: '알림을 켰어요.',
            errorMessage: '알림을 켜지 못했어요.',
          });
          return result.ok;
        }}
      >
        {summary}
      </ConfirmDialog>

      <ConfirmDialog
        open={dialog === 'delete'}
        onOpenChange={(open) => setDialog(open ? 'delete' : null)}
        title={`"${n.title}" 알림을 삭제할까요?`}
        description={
          n.isRepeat
            ? '이후 반복 발송이 모두 멈추고 발송 기록도 함께 지워져요. 되돌릴 수 없어요.'
            : '발송 기록도 함께 지워지고 되돌릴 수 없어요. 이미 보낸 알림은 휴대폰에서 사라지지 않아요.'
        }
        confirmLabel="알림 삭제"
        variant="destructive"
        onConfirm={async () => {
          const result = await executeAction(() => deleteNotification(n.id), {
            successMessage: '알림을 삭제했어요.',
            errorMessage: '알림을 삭제하지 못했어요.',
          });
          if (result.ok && variant === 'buttons') router.push(ROUTES.DASHBOARD.NOTIFICATION);
          return result.ok;
        }}
      />
    </>
  );

  if (variant === 'buttons') {
    return (
      <>
        <Button variant="ghost" className="text-destructive hover:text-destructive" onClick={() => setDialog('delete')}>
          <Trash />
          삭제
        </Button>
        {canTurnOff && (
          <Button variant="outline" onClick={turnOff}>
            <PowerOff />
            끄기
          </Button>
        )}
        {canTurnOn && (
          <Button variant="outline" onClick={() => setDialog('turnOn')}>
            <Power />
            켜기
          </Button>
        )}
        {/* 되돌릴 수 없는 '지금 보내기'는 발송 안 됨일 때만 주 버튼 — 나머지는 수정이 주 작업 */}
        <Button variant={status === 'missed' ? 'default' : 'outline'} onClick={() => setDialog('send')}>
          <Send />
          지금 보내기
        </Button>
        {canEdit && (
          <Button nativeButton={false} render={<Link href={`${detailHref}/edit`} />}>
            <Edit />
            수정
          </Button>
        )}
        {dialogs}
      </>
    );
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={<Button variant="ghost" size="icon" className="size-8" aria-label={`${n.title} 작업 메뉴`} />}
        >
          <MoreHorizontal />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem render={<Link href={detailHref} />}>
            <Eye />
            상세 보기
          </DropdownMenuItem>
          {canEdit && (
            <DropdownMenuItem render={<Link href={`${detailHref}/edit`} />}>
              <Edit />
              수정
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setDialog('send')}>
            <Send />
            지금 보내기
          </DropdownMenuItem>
          {canTurnOff && (
            <DropdownMenuItem onClick={turnOff}>
              <PowerOff />
              끄기
            </DropdownMenuItem>
          )}
          {canTurnOn && (
            <DropdownMenuItem onClick={() => setDialog('turnOn')}>
              <Power />
              켜기
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onClick={() => setDialog('delete')}>
            <Trash />
            삭제
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {dialogs}
    </>
  );
}
