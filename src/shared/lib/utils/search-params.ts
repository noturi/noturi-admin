import { createSearchParamsWithCache } from './search-params-factory';

export enum PageType {
  USER = 'user',
  OPERATOR = 'operator',
  CATEGORY = 'category',
}

const pageConfigs = {
  [PageType.USER]: {
    email: true,
    name: true,
    createdAt: true,
  },
  [PageType.OPERATOR]: {
    email: true,
    role: true,
    createdAt: true,
  },
  [PageType.CATEGORY]: {
    name: true,
    createdAt: true,
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
