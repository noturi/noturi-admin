'use client';

import { debounce, parseAsInteger, parseAsString, useQueryStates } from 'nuqs';
import { Search } from 'lucide-react';

import { Input } from '@/shared/ui/input';

interface DataTableSearchProps {
  /** URL 키 — 서버 목록 조회에 그대로 넘김 (예: keyword) */
  param: string;
  placeholder: string;
  label: string;
}

/**
 * 열 하나에 묶이지 않는 검색 (예: 이름·이메일·닉네임 한 번에) — URL에 남고 서버에서 거름
 * 입력을 멈추고 0.5초 뒤 한 번만 서버에 요청, 검색어가 바뀌면 1쪽으로
 */
export function DataTableSearch({ param, placeholder, label }: DataTableSearchProps) {
  const [{ [param]: value }, setParams] = useQueryStates(
    { [param]: parseAsString.withDefault(''), page: parseAsInteger.withDefault(1) },
    { shallow: false }
  );

  return (
    <div className="relative">
      <Search
        className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden
      />
      <Input
        type="search"
        aria-label={label}
        placeholder={placeholder}
        defaultValue={value as string}
        onChange={(event) =>
          void setParams(
            { [param]: event.target.value.trim() || null, page: null },
            { limitUrlUpdates: event.target.value ? debounce(500) : undefined }
          )
        }
        className="h-8 w-56 pl-8 lg:w-72"
      />
    </div>
  );
}
