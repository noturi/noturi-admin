'use client';

import { Users, Settings, BarChart3, FolderOpen, LogOut } from 'lucide-react';
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
} from '@/components/ui/sidebar';
import { useAuthStore } from '@/shared/lib/auth';
import { ROUTES } from '@/shared/constants';
import Link from 'next/link';

const items = [
  {
    title: '대시보드',
    url: ROUTES.DASHBOARD.HOME,
    icon: BarChart3,
  },
  {
    title: '사용자 관리',
    url: ROUTES.DASHBOARD.USERS,
    icon: Users,
  },
  {
    title: '카테고리 관리',
    url: ROUTES.DASHBOARD.CATEGORIES,
    icon: FolderOpen,
  },
  {
    title: '설정',
    url: ROUTES.DASHBOARD.SETTINGS,
    icon: Settings,
  },
];

export function AppSidebar() {
  const { user, logout } = useAuthStore();

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
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
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
            <SidebarMenuButton onClick={logout}>
              <LogOut />
              <span>로그아웃</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
