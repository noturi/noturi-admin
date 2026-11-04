import { LoginFormComponent } from '@/features/auth';

type Props = {
  searchParams: Promise<{ reason?: string }>;
};

export default async function LoginPage(props: Props) {
  const { reason } = await props.searchParams;
  return <LoginFormComponent sessionExpired={reason === 'expired'} />;
}
