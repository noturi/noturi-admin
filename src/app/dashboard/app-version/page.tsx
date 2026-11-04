import { getAppVersion } from '@/entities/app-version';
import { AppVersionForm } from '@/features/app-version';
import { PageHeader } from '@/shared/ui/heading';
import PageContainer from '@/shared/ui/page-container';

export const metadata = { title: '앱 버전 | Noturi Admin' };

export default async function AppVersionPage() {
  const appVersion = await getAppVersion();

  return (
    <PageContainer>
      <PageHeader
        title="앱 버전"
        description="앱을 열 때 업데이트 안내·강제 업데이트를 정하는 기준 — 앱을 새로 여는 사용자부터 적용돼요"
      />
      <AppVersionForm appVersion={appVersion} />
    </PageContainer>
  );
}
