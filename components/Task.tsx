import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { TrashIcon, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTasks } from "@/lib/hooks/use-tasks";
import { motion } from "framer-motion";
import { TaskStatus, type Task } from "@/lib/tasks.types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useDroppable } from "@dnd-kit/core";

export function Task({ task: { id, title, status } }: { task: Task }) {
  const { setTaskStatus, deleteTask } = useTasks();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });
  
  const { isOver, setNodeRef: setDroppableRef } = useDroppable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 999 : 1,
  };

  return (
    <motion.div
      ref={(node) => {
        setNodeRef(node);
        setDroppableRef(node);
      }}
      style={style}
      key={`${id}_${status}`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={cn(
        "flex items-center gap-4 p-2 rounded-md bg-muted transition-all duration-200",
        isDragging && "opacity-30 shadow-lg scale-105 bg-blue-50 border-2 border-blue-200",
        isOver && !isDragging && "bg-blue-50 border-2 border-blue-300 scale-102"
      )}
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-200 rounded transition-colors duration-150 flex-shrink-0"
      >
        <GripVertical className="w-4 h-4 text-gray-400 hover:text-gray-600 transition-colors" />
      </div>
      <Checkbox
        id={`task_${id}`}
        onClick={() => setTaskStatus(id, status === TaskStatus.done ? TaskStatus.todo : TaskStatus.done)}
        checked={status === TaskStatus.done}
      />
      <div className="text-sm text-neutral-500 font-medium">TASK-{id}</div>
      <Label
        htmlFor={`task_${id}`}
        className={cn(
          "flex-1 text-sm text-muted-foreground",
          status === TaskStatus.done && "line-through"
        )}
      >
        {title}
      </Label>
      <Button variant="ghost" size="sm" onClick={() => deleteTask(id)}>
        <TrashIcon className="w-4 h-4" />
        <span className="sr-only">Delete</span>
      </Button>
    </motion.div>
  );
}
