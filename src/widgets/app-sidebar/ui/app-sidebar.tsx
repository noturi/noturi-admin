'use client';

import { Users, BarChart3, FolderOpen, LogOut, UserCog, Bell, Smartphone, History } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from '@/shared/ui/sidebar';
import { can, ROUTES, type AuthUser } from '@/shared/lib';
import { logoutAction } from '@/features/auth';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggleButton } from './theme-toggle-button';

interface AppSidebarProps {
  /** 로그인한 관리자 — 서버(dashboard/layout)에서 쿠키로 읽어 전달 */
  user: AuthUser | null;
}

export function AppSidebar({ user }: AppSidebarProps) {
  const { setOpenMobile, isMobile } = useSidebar();
  const pathname = usePathname();
  /** 지금 있는 메뉴 — 대시보드 홈은 정확히 일치할 때만 (모든 경로가 /dashboard로 시작) */
  const isActive = (url: string) =>
    url === ROUTES.DASHBOARD.HOME ? pathname === url : pathname === url || pathname.startsWith(`${url}/`);

  const handleMenuClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  const items = [
    {
      title: '대시보드',
      url: ROUTES.DASHBOARD.HOME,
      icon: BarChart3,
    },
    {
      title: '사용자 관리',
      url: ROUTES.DASHBOARD.USER,
      icon: Users,
    },
    {
      title: '운영자 관리',
      url: ROUTES.DASHBOARD.OPERATOR,
      icon: UserCog,
    },
    {
      title: '기본 카테고리',
      url: ROUTES.DASHBOARD.CATEGORY,
      icon: FolderOpen,
    },
    {
      title: '알림 관리',
      url: ROUTES.DASHBOARD.NOTIFICATION,
      icon: Bell,
      // 서버 권한이 없으면 메뉴도 숨김 (관리자는 알림 조회도 403)
      visible: !!user && can(user).viewNotification(),
    },
    {
      title: '앱 버전',
      url: ROUTES.DASHBOARD.APP_VERSION,
      icon: Smartphone,
      visible: !!user && can(user).manageAppVersion(),
    },
    {
      title: '작업 기록',
      url: ROUTES.DASHBOARD.AUDIT_LOG,
      icon: History,
      visible: !!user && can(user).viewAuditLog(),
    },
  ];

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2 px-4 py-2">
          <div className="flex flex-col gap-0.5 leading-none">
            <span className="font-semibold">Noturi Admin</span>
            <span className="truncate text-xs text-muted-foreground">{user?.email}</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>메뉴</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items
                .filter((item) => item.url && item.visible !== false)
                .map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      isActive={isActive(item.url)}
                      render={
                        <Link
                          href={item.url}
                          onClick={handleMenuClick}
                          aria-current={isActive(item.url) ? 'page' : undefined}
                        />
                      }
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <ThemeToggleButton />
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => logoutAction()}>
              <LogOut />
              <span>로그아웃</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
