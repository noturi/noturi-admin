'use client';

import { usePathname } from 'next/navigation';
import { useCallback } from 'react';
import { useSessionStorage } from '../use-session-storage';
import type { useRouteFunnel } from './use-route-funnel';
import type { FunnelSteps, StateUpdateAction } from './types';

type FunnelStateWithStep<TState extends Record<string, unknown>, TSteps extends FunnelSteps> = Partial<TState> & {
  currentStep: TSteps[number];
};

export const withState =
  <TSteps extends FunnelSteps>([Funnel, navigateToStep]: ReturnType<typeof useRouteFunnel<TSteps>>) =>
  <TState extends Record<string, unknown>>(defaultValue: Partial<TState>) => {
    type FState = FunnelStateWithStep<TState, TSteps>;

    const pathname = usePathname();
    const storageKey = `funnel-state__${pathname}`;

    const [state, setState, clearStorage] = useSessionStorage<FState>(storageKey, defaultValue as FState);

    const updateState = useCallback(
      (action: StateUpdateAction<FState>) => {
        setState((prevState) => {
          const nextState = typeof action === 'function' ? action(prevState) : action;
          const newState = { ...prevState, ...nextState };

          if (newState.currentStep) {
            navigateToStep(newState.currentStep);
          }

          return newState;
        });
      },
      [setState]
    );

    const clearState = useCallback(() => {
      clearStorage();
    }, [clearStorage]);

    return [Funnel, state, updateState, clearState] as const;
  };
