'use client';

import { CalendarIcon, X } from 'lucide-react';
import { format } from 'date-fns/format';
import { startOfToday } from 'date-fns/startOfToday';
import { ko } from 'date-fns/locale/ko';
import { Button } from '@/shared/ui/button';
import { Calendar } from '@/shared/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover';
import { cn } from '@/shared/lib';

interface DatePickerFieldProps {
  value?: Date;
  onChange: (date: Date | undefined) => void;
  placeholder?: string;
  /** 오늘 이전 날짜를 고를 수 없게 (예약·종료일) */
  disablePast?: boolean;
  /** 선택한 날짜를 지우는 버튼 (선택 사항인 필드) */
  clearable?: boolean;
  'aria-invalid'?: boolean;
}

export function DatePickerField({
  value,
  onChange,
  placeholder = '날짜 선택',
  disablePast = false,
  clearable = false,
  ...aria
}: DatePickerFieldProps) {
  return (
    <div className="flex gap-2">
      <Popover>
        <PopoverTrigger
          render={
            <Button
              variant="outline"
              className={cn('w-full justify-start text-left font-normal', !value && 'text-muted-foreground')}
              {...aria}
            />
          }
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(value, 'yyyy년 M월 d일 (EEE)', { locale: ko }) : placeholder}
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={value}
            onSelect={onChange}
            disabled={disablePast ? { before: startOfToday() } : undefined}
            autoFocus
          />
        </PopoverContent>
      </Popover>
      {clearable && value && (
        <Button type="button" variant="ghost" size="icon" aria-label="날짜 지우기" onClick={() => onChange(undefined)}>
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
