import React from 'react';
import { ScrollArea } from '@/shared/ui/scroll-area';

export default function PageContainer({
  children,
  scrollable = true,
}: {
  children: React.ReactNode;
  scrollable?: boolean;
}) {
  return (
    <>
      {scrollable ? (
        <ScrollArea className="h-[calc(100dvh-56px)] md:h-[calc(100dvh-52px)]">
          <div className="flex flex-1 flex-col p-4 md:px-6">{children}</div>
        </ScrollArea>
      ) : (
        <div className="flex h-[calc(100dvh-56px)] flex-1 flex-col overflow-auto p-4 md:h-auto md:px-6">{children}</div>
      )}
    </>
  );
}
