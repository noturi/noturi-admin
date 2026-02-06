import { toast } from 'sonner';

export async function executeAction<T>(
  action: () => Promise<T>,
  options: { successMessage?: string; errorMessage?: string } = {}
): Promise<T | undefined> {
  try {
    const result = await action();
    if (options.successMessage) {
      toast.success(options.successMessage);
    }
    return result;
  } catch {
    toast.error(options.errorMessage ?? '작업에 실패했습니다.');
    return undefined;
  }
}
