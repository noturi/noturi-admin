'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/shared/ui/command';
import { cn } from '@/shared/lib';
import { getUserList } from '@/entities/user';
import type { User } from '@/entities/user';
import { CheckIcon, X, Users } from 'lucide-react';
import logger from '@/shared/lib/utils/logger';
import { useDebouncedCallback } from '@/shared/lib/hooks/use-debounced-callback';

interface UserSelectFieldProps {
  value: string[];
  onChange: (userIds: string[]) => void;
  placeholder?: string;
}

const SEARCH_LIMIT = 100;
const SEARCH_DEBOUNCE_MS = 300;

export function UserSelectField({
  value,
  onChange,
  placeholder = '이름·이메일·닉네임으로 찾기',
}: UserSelectFieldProps) {
  const [users, setUsers] = useState<User[]>([]);
  // 선택된 유저 배지를 그리려면 검색 결과가 바뀌어도 이전에 본 유저 정보를 기억해야 함
  const [knownUsers, setKnownUsers] = useState<Map<string, User>>(new Map());
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const latestRequestRef = useRef(0);

  // 검색 결과 반영 — 이전에 본 유저는 선택 배지용으로 계속 기억
  const applyUsers = (list: User[]) => {
    setUsers(list);
    setKnownUsers((prev) => {
      const next = new Map(prev);
      list.forEach((user) => next.set(user.id, user));
      return next;
    });
  };

  // 서버에서 검색 — 처음 100명만 받아 브라우저에서 거르면 101번째 이후 유저는 찾을 수 없음
  const fetchUsers = (keyword: string) =>
    getUserList({ limit: SEARCH_LIMIT, notification: true, ...(keyword && { keyword }) }).then(
      (response) => response.data ?? []
    );

  const searchUsers = useDebouncedCallback((keyword: string) => {
    const requestId = ++latestRequestRef.current;
    fetchUsers(keyword)
      .then((list) => {
        if (requestId === latestRequestRef.current) applyUsers(list); // 늦게 도착한 이전 검색 결과는 버림
      })
      .catch((error) => logger.error('사용자 검색 실패:', error));
  }, SEARCH_DEBOUNCE_MS);

  // 처음 목록 (#http 브라우저 구현 → /api/proxy) — 수정 화면에서 이미 선택된 유저 배지도 이걸로 표시
  useEffect(() => {
    let ignore = false;
    fetchUsers('')
      .then((list) => {
        if (!ignore) applyUsers(list);
      })
      .catch((error) => logger.error('사용자 목록을 불러오지 못함:', error));
    return () => {
      ignore = true;
    };
  }, []);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    searchUsers(query.trim());
  };

  const selectedUsers = value.map((id) => knownUsers.get(id)).filter((user): user is User => !!user);

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
      {/* 선택된 사용자 */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedUsers.map((user) => (
            <Badge key={user.id} variant="secondary" className="gap-1 px-2 py-1">
              {user.name || user.nickname}
              <button
                type="button"
                aria-label={`${user.name || user.nickname} 빼기`}
                onClick={() => handleRemoveUser(user.id)}
                className="ml-1 rounded-full hover:bg-secondary-foreground/20"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          {/* 수정 화면에서 아직 불러오지 않은 대상 — 수가 어긋나 보이지 않게 따로 표시 */}
          {value.length > selectedUsers.length && (
            <Badge variant="outline" className="px-2 py-1">
              외 {(value.length - selectedUsers.length).toLocaleString()}명
            </Badge>
          )}
          <span className="self-center text-sm text-muted-foreground tabular-nums">
            총 {value.length.toLocaleString()}명
          </span>
        </div>
      )}

      {/* 사용자 검색 및 선택 */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger render={<Button variant="outline" role="combobox" className="w-full justify-between" />}>
          {placeholder}
          <Users className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command shouldFilter={false}>
            <CommandInput
              placeholder="이름, 이메일, 닉네임으로 검색..."
              value={searchQuery}
              onValueChange={handleSearchChange}
            />
            <CommandList>
              <CommandEmpty>검색 결과가 없습니다.</CommandEmpty>
              <CommandGroup>
                {users.map((user) => {
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
                          'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                          isSelected ? 'bg-primary' : 'opacity-50 [&_svg]:invisible'
                        )}
                      >
                        <CheckIcon className="h-4 w-4" />
                      </div>
                      <div className="flex flex-col">
                        <span>{user.name || user.nickname}</span>
                        <span className="text-xs text-muted-foreground">{user.email}</span>
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
