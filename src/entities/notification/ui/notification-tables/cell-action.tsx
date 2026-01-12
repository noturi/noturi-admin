'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/shared/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/shared/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/ui/alert-dialog';
import { Notification } from '@/entities/notification/model/types';
import { MoreHorizontal, Eye, Edit, Power, PowerOff, Send, Trash } from 'lucide-react';
import { updateNotification, deleteNotification, sendNotification } from '@/features/notification/api';
import { toast } from 'sonner';

interface CellActionProps {
  data: Notification;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [sendDialogOpen, setSendDialogOpen] = useState(false);

  const handleToggleActive = async () => {
    await updateNotification(data.id, { isActive: !data.isActive });
    toast.success(data.isActive ? '알림이 비활성화되었습니다.' : '알림이 활성화되었습니다.');
  };

  const handleDelete = async () => {
    await deleteNotification(data.id);
    toast.success('알림이 삭제되었습니다.');
    setDeleteDialogOpen(false);
  };

  const handleSend = async () => {
    try {
      const result = await sendNotification(data.id);
      if (result.success) {
        toast.success(`${result.message} (성공: ${result.successCount}, 실패: ${result.failCount})`);
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error('발송에 실패했습니다.');
    }
    setSendDialogOpen(false);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => router.push(`/dashboard/notification/${data.id}`)}>
            <Eye className="mr-2 h-4 w-4" />
            상세 보기
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push(`/dashboard/notification/${data.id}/edit`)}>
            <Edit className="mr-2 h-4 w-4" />
            수정
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setSendDialogOpen(true)}>
            <Send className="mr-2 h-4 w-4" />
            즉시 발송
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleToggleActive}>
            {data.isActive ? (
              <>
                <PowerOff className="mr-2 h-4 w-4" />
                비활성화
              </>
            ) : (
              <>
                <Power className="mr-2 h-4 w-4" />
                활성화
              </>
            )}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-red-600" onClick={() => setDeleteDialogOpen(true)}>
            <Trash className="mr-2 h-4 w-4" />
            삭제
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>알림 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              정말 이 알림을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={sendDialogOpen} onOpenChange={setSendDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>알림 발송</AlertDialogTitle>
            <AlertDialogDescription>이 알림을 즉시 발송하시겠습니까?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={handleSend}>발송</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
