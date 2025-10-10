import { createSearchParamsCache, createSerializer, parseAsInteger, parseAsString, type ParserMap } from 'nuqs/server';

export interface SearchParamsConfig {
  page?: boolean;
  perPage?: boolean;
  email?: boolean;
  role?: boolean;
  createdAt?: boolean;
  [key: string]: boolean | undefined;
}

export function createSearchParams(config: SearchParamsConfig): ParserMap {
  const params: ParserMap = {};

  // 기본 페이지네이션 파라미터
  if (config.page !== false) {
    params.page = parseAsInteger.withDefault(1);
  }

  if (config.perPage !== false) {
    params.perPage = parseAsInteger.withDefault(10);
  }

  // 선택적 파라미터들
  if (config.email) {
    params.email = parseAsString;
  }

  if (config.role) {
    params.role = parseAsString;
  }

  if (config.createdAt) {
    params.createdAt = parseAsString;
  }

  if (config.sort) {
    params.sort = parseAsString;
  }

  // 추가 커스텀 파라미터들
  Object.entries(config).forEach(([key, enabled]) => {
    if (enabled && !['page', 'perPage', 'email', 'role', 'createdAt', 'sort'].includes(key)) {
      params[key] = parseAsString;
    }
  });

  return params;
}

export function createSearchParamsWithCache(config: SearchParamsConfig) {
  const params = createSearchParams(config);
  const cache = createSearchParamsCache(params);
  const serializer = createSerializer(params);

  return {
    params,
    cache,
    serialize: serializer,
  };
}
