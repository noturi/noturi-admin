import { type RouteFunnelOptions, useRouteFunnel } from './use-route-funnel';
import { withState as _withState } from './withState';
import type { FunnelSteps } from './types';

export function useFunnel<T extends FunnelSteps>(steps: T, options: RouteFunnelOptions<T> = {}) {
  const [Funnel, navigateToStep] = useRouteFunnel<T>(steps, options);
  const withState = _withState<T>([Funnel, navigateToStep]);

  return Object.assign([Funnel, navigateToStep], { withState });
}
