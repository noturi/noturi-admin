'use client';

import * as React from 'react';
import { type DragEndEvent } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Badge } from '@/shared/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';
import { Sortable, SortableHandle, arrayMove } from '@/shared/ui/sortable';
import { reorderCategories } from '@/features/category/api';
import { executeAction } from '@/shared/lib';
import { Category } from '@/entities/category/model/types';
import { CellAction } from './cell-action';

interface CategoryTableParams {
  data: Category[];
}

function SortableRow({ category }: { category: Category }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: category.id,
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <TableRow ref={setNodeRef} style={style} className={isDragging ? 'opacity-50' : ''}>
      <TableCell className="w-10">
        <span {...attributes} {...listeners}>
          <SortableHandle />
        </span>
      </TableCell>
      <TableCell>
        <div className="min-w-[120px] truncate font-medium">{category.name}</div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded-full border" style={{ backgroundColor: category.color }} />
          <span className="text-muted-foreground text-sm">{category.color}</span>
        </div>
      </TableCell>
      <TableCell>
        <div className="text-muted-foreground max-w-[300px] truncate text-sm">{category.description || '-'}</div>
      </TableCell>
      <TableCell>
        <div className="text-center font-mono">{category.sortOrder}</div>
      </TableCell>
      <TableCell>
        <Badge variant={category.isActive ? 'default' : 'secondary'}>{category.isActive ? '활성' : '비활성'}</Badge>
      </TableCell>
      <TableCell>
        <div className="min-w-[100px]">{new Date(category.createdAt).toLocaleDateString('ko-KR')}</div>
      </TableCell>
      <TableCell>
        <CellAction data={category} />
      </TableCell>
    </TableRow>
  );
}

export function CategoryTable({ data }: CategoryTableParams) {
  const [categories, setCategories] = React.useState(data);

  React.useEffect(() => {
    setCategories(data);
  }, [data]);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = categories.findIndex((c) => c.id === active.id);
    const newIndex = categories.findIndex((c) => c.id === over.id);
    const reordered = arrayMove(categories, oldIndex, newIndex);

    setCategories(reordered);

    const result = await executeAction(
      () => reorderCategories(reordered.map((c, index) => ({ id: c.id, sortOrder: index + 1 }))),
      {
        successMessage: '카테고리 순서가 변경되었습니다.',
        errorMessage: '순서 변경에 실패했습니다.',
      }
    );
    if (result === undefined) {
      setCategories(data);
    }
  };

  const itemIds = React.useMemo(() => categories.map((c) => c.id), [categories]);

  return (
    <div className="w-full space-y-4">
      <Sortable items={itemIds} onDragEnd={handleDragEnd}>
        <div className="overflow-x-auto rounded-lg border">
          <Table className="min-w-[640px]">
            <TableHeader>
              <TableRow>
                <TableHead className="w-10" />
                <TableHead>카테고리명</TableHead>
                <TableHead>색상</TableHead>
                <TableHead>설명</TableHead>
                <TableHead>정렬 순서</TableHead>
                <TableHead>상태</TableHead>
                <TableHead>등록일</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.length ? (
                categories.map((category) => <SortableRow key={category.id} category={category} />)
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    검색 결과가 없습니다.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Sortable>
    </div>
  );
}
