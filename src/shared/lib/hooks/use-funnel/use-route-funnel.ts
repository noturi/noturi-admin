'use client';

import { useQueryState, parseAsString } from 'nuqs';
import React, { useMemo } from 'react';
import type { FunnelSteps, FunnelComponent, FunnelProps, FunnelStepProps } from './types';

export interface RouteFunnelOptions<T extends FunnelSteps> {
  initialStep?: T[number];
  stepQueryKey?: string;
  onStepChange?: (step: T[number]) => void;
  history?: 'push' | 'replace';
}

export interface NavigateOptions {
  history?: 'push' | 'replace';
}

export const DEFAULT_STEP_QUERY_KEY = 'funnel-step';
export const DEFAULT_HISTORY = 'push';

export function useRouteFunnel<T extends FunnelSteps>(
  steps: T,
  options: RouteFunnelOptions<T> = {}
): [FunnelComponent, (step: T[number], navOptions?: NavigateOptions) => void] {
  const { initialStep, stepQueryKey = DEFAULT_STEP_QUERY_KEY, onStepChange, history: defaultHistory } = options;

  const defaultStep = initialStep ?? steps[0];
  const [currentStep, setCurrentStep] = useQueryState(stepQueryKey, parseAsString.withDefault(defaultStep));

  const navigateToStep = (step: T[number], navOptions?: NavigateOptions) => {
    const { history = defaultHistory || DEFAULT_HISTORY } = navOptions || {};
    setCurrentStep(step, { history });
    onStepChange?.(step);
  };

  const FunnelContainer = useMemo(() => {
    const Step = ({ name, children }: FunnelStepProps) => {
      return currentStep === name ? React.createElement(React.Fragment, null, children) : null;
    };

    const Container = Object.assign(
      ({ children }: FunnelProps) => {
        return React.createElement(React.Fragment, null, children);
      },
      { Step }
    );

    return Container as FunnelComponent;
  }, [currentStep]);

  return [FunnelContainer, navigateToStep];
}
