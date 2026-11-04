'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { SidebarMenuButton } from '@/shared/ui/sidebar';

/**
 * 라이트·다크 전환 — 아이콘·문구는 CSS(dark:)로 바꿔, 서버 렌더링과 첫 화면이 어긋나지 않게 함
 */
export function ThemeToggleButton() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <SidebarMenuButton onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}>
      <Moon className="dark:hidden" />
      <Sun className="hidden dark:block" />
      <span className="dark:hidden">다크 모드</span>
      <span className="hidden dark:inline">라이트 모드</span>
    </SidebarMenuButton>
  );
}
