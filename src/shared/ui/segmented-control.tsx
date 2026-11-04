'use client';

import { Radio } from '@base-ui/react/radio';
import { RadioGroup } from '@base-ui/react/radio-group';

import { cn } from '@/shared/lib';

export interface SegmentedOption<T extends string> {
  value: T;
  label: string;
  /** 선택지 아래 작은 설명 (예: "바로 발송") */
  hint?: string;
}

interface SegmentedControlProps<T extends string> {
  value: T | '' | undefined;
  onValueChange: (value: T) => void;
  options: readonly SegmentedOption<T>[];
  'aria-label'?: string;
  'aria-invalid'?: boolean;
  className?: string;
}

/**
 * 한 번에 하나만 고르는 선택지를 모두 펼쳐 보이는 세그먼트 (Base UI RadioGroup — 화살표 키로 이동)
 * Select와 달리 선택지가 항상 보여, 발송 방식처럼 결과가 큰 결정에 사용
 */
export function SegmentedControl<T extends string>({
  value,
  onValueChange,
  options,
  className,
  ...aria
}: SegmentedControlProps<T>) {
  return (
    <RadioGroup
      value={value || null}
      onValueChange={(next) => onValueChange(next as T)}
      className={cn('grid gap-2 sm:auto-cols-fr sm:grid-flow-col', className)}
      {...aria}
    >
      {options.map((option) => (
        <Radio.Root
          key={option.value}
          value={option.value}
          className="flex flex-col items-start gap-0.5 rounded-md border border-input bg-background px-3 py-2.5 text-left text-sm shadow-xs transition-[color,box-shadow,background-color] outline-none hover:bg-accent focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 in-aria-invalid:border-destructive data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground data-checked:hover:bg-primary/90 dark:bg-input/30 dark:data-checked:bg-primary"
        >
          <span className="font-medium">{option.label}</span>
          {option.hint && <span className="text-xs break-keep opacity-70">{option.hint}</span>}
        </Radio.Root>
      ))}
    </RadioGroup>
  );
}
