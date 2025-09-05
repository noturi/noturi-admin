import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { categoryApi } from '@/entities/category/api';
import { QUERY_KEYS } from '@/shared/lib/query-keys';
import type { CreateCategoryRequest, UpdateCategoryRequest } from '@/entities/category/model/types';

/**
 * 카테고리 생성 mutation
 */
export const useCreateCategoryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCategoryRequest) => categoryApi.create(data),
    onSuccess: () => {
      // 카테고리 목록 캐시 무효화
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.defaultCategories,
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.defaultCategoriesActive,
      });
      toast.success('카테고리가 생성되었습니다.');
    },
    onError: (error) => {
      console.error('카테고리 생성 실패:', error);
      toast.error('카테고리 생성에 실패했습니다.');
    },
  });
};

/**
 * 카테고리 수정 mutation
 */
export const useUpdateCategoryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCategoryRequest }) => categoryApi.update(id, data),
    onSuccess: (updatedCategory) => {
      // 관련 캐시 무효화
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.defaultCategories,
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.defaultCategoriesActive,
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.defaultCategory(updatedCategory.id),
      });
      toast.success('카테고리가 수정되었습니다.');
    },
    onError: (error) => {
      console.error('카테고리 수정 실패:', error);
      toast.error('카테고리 수정에 실패했습니다.');
    },
  });
};

/**
 * 카테고리 삭제 mutation
 */
export const useDeleteCategoryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => categoryApi.delete(id),
    onSuccess: (_, deletedId) => {
      // 관련 캐시 무효화
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.defaultCategories,
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.defaultCategoriesActive,
      });
      // 삭제된 카테고리의 상세 캐시 제거
      queryClient.removeQueries({
        queryKey: QUERY_KEYS.defaultCategory(deletedId),
      });
      toast.success('카테고리가 삭제되었습니다.');
    },
    onError: (error) => {
      console.error('카테고리 삭제 실패:', error);
      toast.error('카테고리 삭제에 실패했습니다.');
    },
  });
};
