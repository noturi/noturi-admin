import { redirect } from 'next/navigation';
import { auth } from '@/shared/lib';
import { AppSidebar } from '@/widgets/ui/app-sidebar';
import { SidebarProvider, SidebarInset } from '@/shared/ui/sidebar';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth();

  if (!userId) {
    redirect('/auth/login');
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <main className="flex-1 space-y-4 p-8 pt-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
