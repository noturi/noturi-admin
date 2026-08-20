'use client';

import { cn } from '@/shared/lib';

interface MonthDaysGridProps {
  value: number[];
  onChange: (days: number[]) => void;
}

const MONTH_DAYS = Array.from({ length: 31 }, (_, i) => i + 1);

export function MonthDaysGrid({ value, onChange }: MonthDaysGridProps) {
  const toggleDay = (day: number) => {
    if (value.includes(day)) {
      onChange(value.filter((d) => d !== day));
    } else {
      onChange([...value, day].sort((a, b) => a - b));
    }
  };

  return (
    <div className="grid w-fit grid-cols-7 gap-1 rounded-md border p-3">
      {MONTH_DAYS.map((day) => {
        const selected = value.includes(day);
        return (
          <button
            key={day}
            type="button"
            aria-pressed={selected}
            onClick={() => toggleDay(day)}
            className={cn(
              'flex h-9 w-9 cursor-pointer items-center justify-center rounded-md text-sm transition-colors',
              selected ? 'bg-primary text-primary-foreground' : 'hover:bg-accent hover:text-accent-foreground'
            )}
          >
            {day}
          </button>
        );
      })}
    </div>
  );
}
