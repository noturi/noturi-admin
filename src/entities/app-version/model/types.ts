import { z } from 'zod';

export const VERSION_PATTERN = /^\d+\.\d+\.\d+$/;

/** 서버 app_versions 한 줄 — 앱은 현재 버전 < 최소 지원 버전이면 강제 업데이트, < 최신 버전이면 새 버전 안내 */
export const AppVersionSchema = z.object({
  id: z.string(),
  iosVersion: z.string(),
  iosMinVersion: z.string(),
  iosStoreUrl: z.string(),
  androidVersion: z.string(),
  androidMinVersion: z.string(),
  androidStoreUrl: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type AppVersion = z.infer<typeof AppVersionSchema>;
export type AppVersionInput = Omit<AppVersion, 'id' | 'createdAt' | 'updatedAt'>;

export const PLATFORMS = [
  { key: 'ios', label: 'iOS', store: '앱스토어' },
  { key: 'android', label: 'Android', store: '플레이스토어' },
] as const;

export type PlatformKey = (typeof PLATFORMS)[number]['key'];

/** 앱과 같은 비교 (noturi-client version-utils) — -1: a < b, 0: 같음, 1: a > b */
export function compareVersions(a: string, b: string): number {
  const pa = a.split('.').map(Number);
  const pb = b.split('.').map(Number);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const x = pa[i] || 0;
    const y = pb[i] || 0;
    if (x !== y) return x < y ? -1 : 1;
  }
  return 0;
}
