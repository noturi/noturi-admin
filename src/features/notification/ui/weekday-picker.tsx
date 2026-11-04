'use client';

import { REPEAT_DAYS_MAP } from '@/entities/notification';
import { cn } from '@/shared/lib';

interface WeekdayPickerProps {
  value: number[];
  onChange: (days: number[]) => void;
  'aria-labelledby'?: string;
}

const WEEK = [1, 2, 3, 4, 5, 6, 0]; // 월요일부터 (한국 달력 관례)

/** 반복 요일 — 키보드로 이동·선택 가능한 토글 버튼 (MonthDaysGrid와 같은 방식) */
export function WeekdayPicker({ value, onChange, ...aria }: WeekdayPickerProps) {
  const toggle = (day: number) =>
    onChange(value.includes(day) ? value.filter((d) => d !== day) : [...value, day].sort((a, b) => a - b));

  return (
    <div role="group" className="flex flex-wrap gap-1.5" {...aria}>
      {WEEK.map((day) => {
        const selected = value.includes(day);
        return (
          <button
            key={day}
            type="button"
            aria-pressed={selected}
            onClick={() => toggle(day)}
            className={cn(
              'flex h-9 w-11 items-center justify-center rounded-md border text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50',
              selected
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-input hover:bg-accent hover:text-accent-foreground'
            )}
          >
            {REPEAT_DAYS_MAP[day]}
          </button>
        );
      })}
    </div>
  );
}
