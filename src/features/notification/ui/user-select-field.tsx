'use client';

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/shared/ui/command';
import { cn } from '@/shared/lib';
import { searchUsers } from '@/features/notification/api/user-search-action';
import type { User } from '@/entities/user/model/types';
import { CheckIcon, X, Users } from 'lucide-react';

interface UserSelectFieldProps {
  value: string[];
  onChange: (userIds: string[]) => void;
  placeholder?: string;
}

export function UserSelectField({ value, onChange, placeholder = '유저 검색 및 선택' }: UserSelectFieldProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // 유저 목록 로드
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const userList = await searchUsers();
        setUsers(userList);
      } catch (error) {
        console.error('Failed to load users:', error);
      }
    };
    loadUsers();
  }, []);

  // 검색된 유저 필터링
  const filteredUsers = useMemo(() => {
    if (!searchQuery) return users;
    const query = searchQuery.toLowerCase();
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.nickname.toLowerCase().includes(query)
    );
  }, [users, searchQuery]);

  // 선택된 유저 정보
  const selectedUsers = useMemo(() => {
    return users.filter((user) => value.includes(user.id));
  }, [users, value]);

  const handleToggleUser = (userId: string) => {
    if (value.includes(userId)) {
      onChange(value.filter((id) => id !== userId));
    } else {
      onChange([...value, userId]);
    }
  };

  const handleRemoveUser = (userId: string) => {
    onChange(value.filter((id) => id !== userId));
  };

  return (
    <div className="space-y-2">
      {/* 선택된 유저 표시 */}
      {selectedUsers.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedUsers.map((user) => (
            <Badge key={user.id} variant="secondary" className="gap-1 px-2 py-1">
              {user.name || user.nickname}
              <button
                type="button"
                onClick={() => handleRemoveUser(user.id)}
                className="hover:bg-secondary-foreground/20 ml-1 rounded-full"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* 유저 검색 및 선택 */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" role="combobox" className="w-full justify-between">
            {placeholder}
            <Users className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput
              placeholder="이름, 이메일, 닉네임으로 검색..."
              value={searchQuery}
              onValueChange={setSearchQuery}
            />
            <CommandList>
              <CommandEmpty>검색 결과가 없습니다.</CommandEmpty>
              <CommandGroup>
                {filteredUsers.map((user) => {
                  const isSelected = value.includes(user.id);
                  return (
                    <CommandItem
                      key={user.id}
                      onSelect={() => {
                        handleToggleUser(user.id);
                      }}
                    >
                      <div
                        className={cn(
                          'border-primary mr-2 flex h-4 w-4 items-center justify-center rounded-sm border',
                          isSelected ? 'bg-primary' : 'opacity-50 [&_svg]:invisible'
                        )}
                      >
                        <CheckIcon className="h-4 w-4" />
                      </div>
                      <div className="flex flex-col">
                        <span>{user.name || user.nickname}</span>
                        <span className="text-muted-foreground text-xs">{user.email}</span>
                      </div>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
