'use client';

import { EmailStep, RoleStep, PasswordStep, type FunnelState, registerAction } from '@/features/auth';
import { useFunnel } from '@/shared/lib';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function UserRegisterPage() {
  const router = useRouter();
  const [Funnel, funnelState, updateFunnelState, clearFunnelState] = useFunnel(['email', 'role', 'password'] as const, {
    initialStep: 'email',
    history: 'replace',
  }).withState<Omit<FunnelState, 'currentStep'>>({});

  return (
    <Funnel>
      <Funnel.Step name="email">
        <EmailStep
          defaultValues={{ email: funnelState.email, name: funnelState.name, nickname: funnelState.nickname }}
          next={(data) => {
            updateFunnelState({ email: data.email, name: data.name, nickname: data.nickname, currentStep: 'role' });
          }}
        />
      </Funnel.Step>
      <Funnel.Step name="role">
        <RoleStep
          defaultValue={funnelState.role}
          next={(role) => {
            updateFunnelState({ role, currentStep: 'password' });
          }}
        />
      </Funnel.Step>
      <Funnel.Step name="password">
        <PasswordStep
          defaultValues={funnelState}
          next={async ({ password, confirmPassword }) => {
            const result = await registerAction({
              email: funnelState.email!,
              name: funnelState.name!,
              nickname: funnelState.nickname!,
              role: funnelState.role!,
              password,
              confirmPassword,
            });

            if (result?.error) {
              toast.error(result.error);
            } else {
              toast.success('사용자 등록이 완료되었습니다!');
              clearFunnelState();
              router.push('/dashboard/user');
            }
          }}
        />
      </Funnel.Step>
    </Funnel>
  );
}
