'use client';

import { Button } from '@/shared/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/shared/ui/dropdown-menu';
import { User } from '@/entities/user/model/types';
import { MoreHorizontal, Trash, Edit } from 'lucide-react';
import { deleteUser } from '@/features/user/api';

interface UserPermissions {
  deleteUser: (targetUser: User) => boolean;
  updateUser: (targetUser: User) => boolean;
  viewUser: (targetUser: User) => boolean;
}

interface CellActionProps {
  data: User;
  permissions: UserPermissions;
}

export const CellAction: React.FC<CellActionProps> = ({ data, permissions }) => {
  const canDelete = permissions.deleteUser(data);
  const canUpdate = permissions.updateUser(data);

  if (!canDelete && !canUpdate) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {canUpdate && (
          <DropdownMenuItem>
            <Edit className="mr-2 h-4 w-4" />
            수정
          </DropdownMenuItem>
        )}
        {canDelete && (
          <DropdownMenuItem className="text-red-600" onClick={() => deleteUser(data.id)}>
            <Trash className="mr-2 h-4 w-4" />
            삭제
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
