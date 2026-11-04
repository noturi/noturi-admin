import { Skeleton } from '@/shared/ui/skeleton';
import PageContainer from '@/shared/ui/page-container';

export default function DashboardLoading() {
  return (
    <PageContainer>
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-72" />
      </div>
      <Skeleton className="h-px w-full" />
      <Skeleton className="h-64 w-full" />
    </PageContainer>
  );
}
