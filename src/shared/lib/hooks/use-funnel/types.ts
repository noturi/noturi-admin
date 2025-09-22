import { ReactNode } from 'react';

export type FunnelSteps = readonly [string, ...string[]];

// 퍼널 상태 업데이트 액션
export type StateUpdateAction<T> = T | ((prevState: T) => T);

// 퍼널 컴포넌트 Props
export interface FunnelProps {
  children: ReactNode;
}

// 스텝 컴포넌트 Props
export interface FunnelStepProps {
  name: string;
  children: ReactNode;
}

// 퍼널 컴포넌트 인터페이스
export interface FunnelComponent extends React.FC<FunnelProps> {
  Step: React.FC<FunnelStepProps>;
}

// 퍼널 옵션
export interface UseFunnelOptions<T extends FunnelSteps> {
  initialStep: T[number];
  onStepChange?: (step: T[number]) => void;
}
