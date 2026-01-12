import { redirect } from 'next/navigation';
import { auth } from '@/shared/lib';
import { AppSidebar } from '@/widgets/ui/app-sidebar';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/shared/ui/sidebar';
import { Separator } from '@/shared/ui/separator';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth();

  if (!userId) {
    redirect('/auth/login');
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4 md:hidden">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <span className="font-semibold">Noturi Admin</span>
        </header>
        <main className="flex-1 space-y-4 p-4 pt-4 md:p-8 md:pt-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
