'use client';

import { Button } from '@/shared/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/shared/ui/dropdown-menu';
import { Operator } from '@/entities/operator/model/types';
import { MoreHorizontal, Trash, Edit } from 'lucide-react';

// TODO: Implement deleteOperator function
const deleteOperator = (id: string) => {
  console.log('TODO: Delete operator', id);
};

interface CellActionProps {
  data: Operator;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>
          <Edit className="mr-2 h-4 w-4" />
          수정
        </DropdownMenuItem>
        <DropdownMenuItem className="text-red-600" onClick={() => deleteOperator(data.id)}>
          <Trash className="mr-2 h-4 w-4" />
          삭제
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
