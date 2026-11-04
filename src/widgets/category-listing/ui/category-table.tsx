'use client';

import * as React from 'react';
import { type DragEndEvent } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

import { Category } from '@/entities/category';
import { CategoryRowActions, reorderCategories } from '@/features/category';
import { executeAction, formatKstDate } from '@/shared/lib';
import { Badge } from '@/shared/ui/badge';
import { Sortable, arrayMove } from '@/shared/ui/sortable';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';

function SortableRow({ category, order, isLastActive }: { category: Category; order: number; isLastActive: boolean }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: category.id });

  return (
    <TableRow
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={isDragging ? 'relative z-10 bg-background opacity-80 shadow-md' : undefined}
    >
      <TableCell className="w-10">
        <button
          type="button"
          className="flex size-8 cursor-grab items-center justify-center rounded-md text-muted-foreground hover:bg-accent active:cursor-grabbing"
          aria-label={`${category.name} 순서 바꾸기 — 끌거나, 스페이스로 잡고 화살표로 옮기기`}
          {...attributes}
          {...listeners}
        >
          <GripVertical className="size-4" />
        </button>
      </TableCell>
      {/* 화면 순서 = 새 사용자 앱에 보이는 순서. 서버 sortOrder 값이 아니라 지금 위치를 보여줌 */}
      <TableCell className="w-12 text-right text-muted-foreground tabular-nums">{order}</TableCell>
      <TableCell>
        <div className="flex min-w-32 items-center gap-2">
          <span className="size-3 shrink-0 rounded-full" style={{ backgroundColor: category.color }} aria-hidden />
          <span className="truncate font-medium">{category.name}</span>
        </div>
      </TableCell>
      <TableCell>
        <div className="max-w-xs truncate text-sm text-muted-foreground">{category.description || '-'}</div>
      </TableCell>
      <TableCell>
        <Badge variant={category.isActive ? 'secondary' : 'outline'}>{category.isActive ? '켜짐' : '꺼짐'}</Badge>
      </TableCell>
      <TableCell className="text-muted-foreground tabular-nums">{formatKstDate(category.createdAt)}</TableCell>
      <TableCell className="sticky right-0 w-12 bg-background">
        <CategoryRowActions category={category} isLastActive={isLastActive} />
      </TableCell>
    </TableRow>
  );
}

/** 기본 카테고리 목록 — 끌어서 순서 변경. 서버는 정렬·페이지를 지원하지 않아 전체를 한 번에 보여줌 */
export function CategoryTable({ data }: { data: Category[] }) {
  const [categories, setCategories] = React.useState(data);

  // 서버 데이터가 바뀌면(revalidatePath) 그 값으로 맞춤 — 렌더 중 상태 조정
  const [prevData, setPrevData] = React.useState(data);
  if (data !== prevData) {
    setPrevData(data);
    setCategories(data);
  }

  const activeCount = categories.filter((c) => c.isActive).length;

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const reordered = arrayMove(
      categories,
      categories.findIndex((c) => c.id === active.id),
      categories.findIndex((c) => c.id === over.id)
    );
    setCategories(reordered);

    const result = await executeAction(
      () => reorderCategories(reordered.map((c, index) => ({ id: c.id, sortOrder: index + 1 }))),
      { successMessage: '순서를 바꿨어요.', errorMessage: '순서를 바꾸지 못했어요. 원래 순서로 돌려놨어요.' }
    );
    // 실패했을 때만 되돌림 (예전에는 void 액션의 성공을 실패로 오인해 항상 되돌아갔음)
    // 실패하면 서버가 가진 마지막 순서(data)로 — 연속으로 끈 경우에도 화면과 서버가 어긋나지 않게
    if (!result.ok) setCategories(data);
  };

  const itemIds = categories.map((c) => c.id); // React Compiler가 메모이즈

  return (
    <div className="space-y-3">
      <p className="text-sm break-keep text-muted-foreground">
        켜진 카테고리가 새로 가입하는 사용자의 앱에 이 순서대로 만들어져요. 이미 가입한 사용자에게는 영향이 없어요.
      </p>
      <Sortable items={itemIds} onDragEnd={handleDragEnd}>
        <div className="overflow-x-auto rounded-lg border">
          <Table className="min-w-[640px]">
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">
                  <span className="sr-only">순서 바꾸기</span>
                </TableHead>
                <TableHead className="w-12 text-right">순서</TableHead>
                <TableHead>이름</TableHead>
                <TableHead>운영 메모</TableHead>
                <TableHead>상태</TableHead>
                <TableHead>만든 날</TableHead>
                <TableHead className="sticky right-0 w-12 bg-background">
                  <span className="sr-only">작업</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.length ? (
                categories.map((category, index) => (
                  <SortableRow
                    key={category.id}
                    category={category}
                    order={index + 1}
                    isLastActive={category.isActive && activeCount === 1}
                  />
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="h-32 text-center break-keep whitespace-normal text-muted-foreground"
                  >
                    기본 카테고리가 없어요. 지금은 새 사용자에게 서버 기본값(영화·음악·책)이 만들어져요.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Sortable>
      <p className="text-sm text-muted-foreground tabular-nums">
        총 {categories.length.toLocaleString()}개 · 켜짐 {activeCount.toLocaleString()}개
      </p>
    </div>
  );
}
