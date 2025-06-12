"use client";

import { AddTodo } from "@/components/AddTodo";
import { Task } from "@/components/Task";
import { useTasks } from "@/lib/hooks/use-tasks";
import { TaskStatus } from "@/lib/tasks.types";
import { AnimatePresence } from "framer-motion";
import { DndContext, closestCenter, DragEndEvent, DragOverlay, DragStartEvent } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useState } from "react";

export function TasksList() {
  const { tasks, reorderTasks } = useTasks();
  const [activeTask, setActiveTask] = useState<any>(null);

  const sortedTasks = tasks.sort((a, b) => {
    if (a.status === b.status) {
      return a.order - b.order;
    }
    return a.status === TaskStatus.todo ? -1 : 1;
  });

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = sortedTasks.find(task => task.id === active.id);
    setActiveTask(task);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    console.log('Drag end event:', { active: active.id, over: over?.id });

    if (over && active.id !== over.id) {
      reorderTasks(Number(active.id), Number(over.id));
    }
    setActiveTask(null);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-8 md:p-24">
      <div className="flex flex-col gap-4 min-w-full md:min-w-[500px]">
        <h1 className="text-2xl font-bold">✍️ My Todos</h1>
        <AddTodo />

        <DndContext 
          collisionDetection={closestCenter} 
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={sortedTasks.map(task => task.id)}
            strategy={verticalListSortingStrategy}
          >
            <AnimatePresence>
              {sortedTasks.map((task) => (
                <Task key={task.id} task={task} />
              ))}
            </AnimatePresence>
          </SortableContext>
          <DragOverlay>
            {activeTask ? (
              <div className="transform rotate-2 scale-105 shadow-2xl border-2 border-blue-400 rounded-md bg-white">
                <Task task={activeTask} />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </main>
  );
}
