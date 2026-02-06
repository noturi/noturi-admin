'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/shared/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';
import { Category } from '@/entities/category/model/types';
import { MoreHorizontal, Trash, Edit, Power } from 'lucide-react';
import { deleteCategory, toggleCategoryActive } from '@/features/category/api';
import { executeAction } from '@/shared/lib';

interface CellActionProps {
  data: Category;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const router = useRouter();

  const handleToggleActive = async () => {
    await executeAction(() => toggleCategoryActive(data.id), {
      successMessage: data.isActive ? '카테고리가 비활성화되었습니다.' : '카테고리가 활성화되었습니다.',
      errorMessage: '상태 변경에 실패했습니다.',
    });
  };

  const handleDelete = async () => {
    if (confirm('정말 이 카테고리를 삭제하시겠습니까?')) {
      await executeAction(() => deleteCategory(data.id), {
        successMessage: '카테고리가 삭제되었습니다.',
        errorMessage: '삭제에 실패했습니다.',
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => router.push(`/dashboard/category/${data.id}/edit`)}>
          <Edit className="mr-2 h-4 w-4" />
          수정
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleToggleActive}>
          <Power className="mr-2 h-4 w-4" />
          {data.isActive ? '비활성화' : '활성화'}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-red-600" onClick={handleDelete}>
          <Trash className="mr-2 h-4 w-4" />
          삭제
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
