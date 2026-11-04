'use client';

import { Users, BarChart3, FolderOpen, LogOut, UserCog, Bell } from 'lucide-react';
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
import { ROUTES, type AuthUser } from '@/shared/lib';
import { logoutAction } from '@/features/auth';
import Link from 'next/link';

interface AppSidebarProps {
  /** 로그인한 관리자 — 서버(dashboard/layout)에서 쿠키로 읽어 전달 */
  user: AuthUser | null;
}

export function AppSidebar({ user }: AppSidebarProps) {
  const { setOpenMobile, isMobile } = useSidebar();

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
      url: '/dashboard/operator',
      icon: UserCog,
    },
    {
      title: '카테고리 관리',
      url: ROUTES.DASHBOARD.CATEGORY,
      icon: FolderOpen,
    },
    {
      title: '알림 관리',
      url: ROUTES.DASHBOARD.NOTIFICATION,
      icon: Bell,
    },
  ];

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2 px-4 py-2">
          <div className="flex flex-col gap-0.5 leading-none">
            <span className="font-semibold">Noturi Admin</span>
            <span className="text-xs text-muted-foreground">{user?.email}</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>메뉴</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items
                .filter((item) => item.url)
                .map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link href={item.url} onClick={handleMenuClick}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
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
