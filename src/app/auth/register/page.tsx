'use client';

import { EmailStep, RoleStep, PasswordStep, type FunnelState, registerAction } from '@/features/auth';
import { useFunnel } from '@/shared/lib';

export default function RegisterPage() {
  const [Funnel, funnelState, updateFunnelState, clearFunnelState] = useFunnel(['email', 'role', 'password'] as const, {
    initialStep: 'email',
    history: 'replace',
  }).withState<Omit<FunnelState, 'currentStep'>>({});

  return (
    <Funnel>
      <Funnel.Step name="email">
        <EmailStep
          defaultValue={funnelState.email}
          next={(email) => {
            updateFunnelState({ email, currentStep: 'role' });
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
            await registerAction({
              email: funnelState.email!,
              role: funnelState.role!,
              password,
              confirmPassword,
            });
            clearFunnelState();
          }}
        />
      </Funnel.Step>
    </Funnel>
  );
}
