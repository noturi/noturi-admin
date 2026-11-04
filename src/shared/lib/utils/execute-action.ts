import { toast } from 'sonner';

/**
 * 성공 여부를 값으로 구분 — void 액션은 성공해도 undefined라 `result !== undefined`로는 성공을 알 수 없음
 * (카테고리 저장 후 화면이 안 넘어가 중복 생성되던 문제, 순서 변경이 되돌아가던 문제의 원인)
 */
export type ActionResult<T> = { ok: true; data: T } | { ok: false };

export async function executeAction<T>(
  action: () => Promise<T>,
  options: { successMessage?: string; errorMessage?: string } = {}
): Promise<ActionResult<T>> {
  try {
    const data = await action();
    if (options.successMessage) {
      toast.success(options.successMessage);
    }
    return { ok: true, data };
  } catch {
    toast.error(options.errorMessage ?? '처리하지 못했어요. 잠시 후 다시 시도해 주세요.');
    return { ok: false };
  }
}
