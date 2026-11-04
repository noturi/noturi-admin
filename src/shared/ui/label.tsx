import * as React from 'react';

import { cn } from '@/shared/lib';

/** Base UI에는 Label 프리미티브가 없음 — 네이티브 <label htmlFor> */
function Label({ className, ...props }: React.ComponentProps<'label'>) {
  return (
    // oxlint-disable-next-line jsx-a11y/label-has-associated-control -- htmlFor는 사용하는 쪽에서 넘김
    <label
      data-slot="label"
      className={cn(
        'flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
        className
      )}
      {...props}
    />
  );
}

export { Label };
