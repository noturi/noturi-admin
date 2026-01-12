'use client';

import { Users, Settings, BarChart3, FolderOpen, LogOut, UserCog, Bell } from 'lucide-react';
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
import { useAuthStore, ROUTES } from '@/shared/lib';
import { logoutAction } from '@/features/auth';
import Link from 'next/link';

export function AppSidebar() {
  const { user } = useAuthStore();
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
    {
      title: '설정',
      url: ROUTES.DASHBOARD.SETTINGS,
      icon: Settings,
    },
  ];

  return (
    <Sidebar>
      <SidebarHeader className="border-sidebar-border border-b">
        <div className="flex items-center gap-2 px-4 py-2">
          <div className="flex flex-col gap-0.5 leading-none">
            <span className="font-semibold">Noturi Admin</span>
            <span className="text-muted-foreground text-xs">{user?.email}</span>
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
      <SidebarFooter className="border-sidebar-border border-t">
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
