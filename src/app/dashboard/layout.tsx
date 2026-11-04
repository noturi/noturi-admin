import { redirect } from 'next/navigation';
import { auth } from '@/shared/lib';
import { AppSidebar } from '@/widgets/app-sidebar';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/shared/ui/sidebar';
import { Separator } from '@/shared/ui/separator';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { userId, user } = await auth();

  if (!userId) {
    redirect('/auth/login');
  }

  return (
    <SidebarProvider>
      <AppSidebar user={user} />
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b bg-background px-4 md:hidden">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <span className="font-semibold">Noturi Admin</span>
        </header>
        {/* 여백은 PageContainer 한 곳에서 */}
        <main className="flex flex-1 flex-col">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
