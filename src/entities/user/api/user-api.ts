import { http } from '#http';
import type {
  UserDetail,
  UserListResponse,
  UserLookupResponse,
  UserQueryParams,
  UserSegment,
  UserSegmentResponse,
} from '../model/types';

export const getUserList = async (params?: UserQueryParams) => {
  return http.get<UserListResponse>('/users', {
    searchParams: {
      ...params,
      role: 'USER',
    },
  });
};

export const getUserById = async (id: string) => {
  return http.get<UserDetail>(`/users/${id}`);
};

/**
 * 사용자 id 목록 → 받을 수 있는 인원 요약(+사용자 목록)
 * 조회지만 id가 수천 개일 수 있어 서버는 POST — 브라우저 프록시(/api/proxy)는 GET만 되므로 서버에서만 호출
 * (클라이언트 화면은 features/notification의 Server Action을 거침)
 */
export const lookupUsers = async (ids: string[], includeUsers = false) => {
  return http.post<UserLookupResponse>('/users/lookup', { json: { ids, includeUsers } });
};

/** 조건에 맞는 앱 사용자 id (알림 대상 묶음) */
export const getSegmentUserIds = async (segment: UserSegment) => {
  return http.get<UserSegmentResponse>('/users/segment-ids', { searchParams: { segment } });
};
