'use client';

import { ThemeProvider } from 'next-themes';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { Toaster } from '@/shared/ui/sonner';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    // 다크 모드: <html class="dark">로 globals.css의 .dark 토큰을 켬. 기본은 운영체제 설정을 따름
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <NuqsAdapter>
        {children}
        <Toaster />
      </NuqsAdapter>
    </ThemeProvider>
  );
}
