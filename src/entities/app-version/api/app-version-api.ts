import { http } from '#http';
import type { AppVersion } from '../model/types';

/**
 * 앱 버전 설정 — 아직 한 번도 저장하지 않았으면 null
 * 서버는 없을 때 200 + 빈 본문을 돌려줘 JSON 파싱이 실패함 → 그 경우만 null (401 등 다른 오류는 그대로)
 */
export async function getAppVersion(): Promise<AppVersion | null> {
  try {
    return await http.get<AppVersion | null>('/app-version');
  } catch (error) {
    if (error instanceof SyntaxError) return null;
    throw error;
  }
}
