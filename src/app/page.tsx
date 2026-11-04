import { redirect } from 'next/navigation';
import { auth, ROUTES } from '@/shared/lib';

export default async function Home() {
  const { isAuthenticated } = await auth();
  redirect(isAuthenticated ? ROUTES.DASHBOARD.HOME : ROUTES.AUTH.LOGIN);
}
