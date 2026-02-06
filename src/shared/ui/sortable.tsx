'use client';

import * as React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  type DragStartEvent,
  type DragEndEvent,
  type UniqueIdentifier,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

import { cn } from '@/shared/lib';

/* ─── Sortable (DndContext + SortableContext 래퍼) ─── */

interface SortableProps {
  items: UniqueIdentifier[];
  onDragEnd: (event: DragEndEvent) => void;
  onDragStart?: (event: DragStartEvent) => void;
  overlay?: React.ReactNode;
  children: React.ReactNode;
}

function Sortable({ items, onDragEnd, onDragStart, overlay, children }: SortableProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={onDragStart} onDragEnd={onDragEnd}>
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        {children}
      </SortableContext>
      {overlay && <DragOverlay>{overlay}</DragOverlay>}
    </DndContext>
  );
}

/* ─── SortableItem ─── */

interface SortableItemProps {
  id: UniqueIdentifier;
  className?: string;
  children: React.ReactNode;
}

function SortableItem({ id, className, children }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(isDragging && 'opacity-50', className)}
      {...attributes}
      {...listeners}
    >
      {children}
    </div>
  );
}

/* ─── SortableHandle ─── */

interface SortableHandleProps {
  className?: string;
}

function SortableHandle({ className }: SortableHandleProps) {
  return (
    <span className={cn('cursor-grab active:cursor-grabbing', className)}>
      <GripVertical className="text-muted-foreground size-4" />
    </span>
  );
}

/* ─── SortableOverlay ─── */

interface SortableOverlayProps {
  children: React.ReactNode;
}

function SortableOverlay({ children }: SortableOverlayProps) {
  return <DragOverlay>{children}</DragOverlay>;
}

export { Sortable, SortableItem, SortableHandle, SortableOverlay, arrayMove };
export type { SortableProps, SortableItemProps };
