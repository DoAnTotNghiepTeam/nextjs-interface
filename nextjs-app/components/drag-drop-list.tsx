"use client"

import type React from "react"

import { useState } from "react"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
  DragOverlay,
} from "@dnd-kit/core"
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical } from "lucide-react"
import { Card } from "@/components/ui/card"

interface DragDropListProps<T> {
  items: T[]
  onReorder: (oldIndex: number, newIndex: number) => void
  renderItem: (item: T, index: number, isDragging?: boolean) => React.ReactNode
  keyExtractor: (item: T) => string
}

interface SortableItemProps {
  id: string
  children: React.ReactNode
  isDragOverlay?: boolean
}

function SortableItem({ id, children, isDragOverlay = false }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  if (isDragOverlay) {
    return <Card className="shadow-lg rotate-3 scale-105">{children}</Card>
  }

  return (
    <div ref={setNodeRef} style={style} className="relative group">
      <div
        {...attributes}
        {...listeners}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded bg-background/80 backdrop-blur-sm border"
      >
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="pl-8">{children}</div>
    </div>
  )
}

export function DragDropList<T>({ items, onReorder, renderItem, keyExtractor }: DragDropListProps<T>) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => keyExtractor(item) === active.id)
      const newIndex = items.findIndex((item) => keyExtractor(item) === over.id)

      onReorder(oldIndex, newIndex)
    }

    setActiveId(null)
  }

  const activeItem = activeId ? items.find((item) => keyExtractor(item) === activeId) : null
  const activeIndex = activeItem ? items.findIndex((item) => keyExtractor(item) === activeId) : -1

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={items.map(keyExtractor)} strategy={verticalListSortingStrategy}>
        <div className="space-y-4">
          {items.map((item, index) => (
            <SortableItem key={keyExtractor(item)} id={keyExtractor(item)}>
              {renderItem(item, index, keyExtractor(item) === activeId)}
            </SortableItem>
          ))}
        </div>
      </SortableContext>
      <DragOverlay>
        {activeItem ? (
          <SortableItem id={keyExtractor(activeItem)} isDragOverlay>
            {renderItem(activeItem, activeIndex, true)}
          </SortableItem>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
