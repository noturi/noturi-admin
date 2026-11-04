import { createSearchParamsWithCache } from './search-params-factory';

export enum PageType {
  USER = 'user',
  OPERATOR = 'operator',
  CATEGORY = 'category',
  NOTIFICATION = 'notification',
  AUDIT_LOG = 'audit-log',
}

const pageConfigs = {
  [PageType.USER]: {
    keyword: true,
    createdAt: true,
    sort: true,
  },
  [PageType.OPERATOR]: {
    email: true,
    role: true,
    createdAt: true,
    sort: true,
  },
  [PageType.CATEGORY]: {
    name: true,
    createdAt: true,
  },
  [PageType.NOTIFICATION]: {
    isActive: true,
    isRepeat: true,
    createdAt: true,
  },
  [PageType.AUDIT_LOG]: {
    action: true,
  },
};

const searchParamsInstances = Object.entries(pageConfigs).reduce(
  (acc, [pageType, config]) => {
    const { params, cache, serialize } = createSearchParamsWithCache(config);
    acc[pageType as PageType] = { params, cache, serialize };
    return acc;
  },
  {} as Record<PageType, ReturnType<typeof createSearchParamsWithCache>>
);

export function getSearchParams(pageType: PageType) {
  return searchParamsInstances[pageType];
}

// 하위 호환성을 위한 기본 export
export const { params: searchParams, cache: searchParamsCache, serialize } = getSearchParams(PageType.OPERATOR);

/**
 * URL의 정렬 값(`[{"id":"createdAt","desc":true}]`)을 서버로 넘길 형태로 — 허용한 열만
 * 서버(/users)는 받은 id를 그대로 orderBy에 넣어, 집계 열(memoCount 등)을 보내면 오류가 남
 */
export function toServerSort(raw: string | null | undefined, allowed: readonly string[]): string | undefined {
  if (!raw) return undefined;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return undefined;
    const valid = parsed.filter(
      (item): item is { id: string; desc: boolean } =>
        typeof item === 'object' &&
        item !== null &&
        allowed.includes((item as { id: unknown }).id as string) &&
        typeof (item as { desc: unknown }).desc === 'boolean'
    );
    return valid.length ? JSON.stringify(valid.map(({ id, desc }) => ({ id, desc }))) : undefined;
  } catch {
    return undefined;
  }
}
