import { createContext, useContext, useState, ReactNode } from "react";
import { defaultTasks } from "../default-tasks";
import { Task, TaskStatus } from "../tasks.types";
import { useCopilotReadable, useCopilotAction } from "@copilotkit/react-core";

let nextId = defaultTasks.length + 1;

type TasksContextType = {
  tasks: Task[];
  addTask: (title: string) => void;
  setTaskStatus: (id: number, status: TaskStatus) => void;
  deleteTask: (id: number) => void;
  reorderTasks: (activeId: number, overId: number) => void;
};

const TasksContext = createContext<TasksContextType | undefined>(undefined);

export const TasksProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>(defaultTasks);

  useCopilotAction({
    name: "addTask",
    description: "Adds a task to the todo list",
    parameters: [
      {
        name: "title",
        type: "string",
        description: "The title of the task",
        required: true,
      },
    ],
    handler: ({ title }) => {
      addTask(title);
    },
  });

  useCopilotAction({
    name: "deleteTask",
    description: "Deletes a task from the todo list",
    parameters: [
      {
        name: "id",
        type: "number",
        description: "The id of the task",
        required: true,
      },
    ],
    handler: ({ id }) => {
      deleteTask(id);
    },
  });

  useCopilotAction({
    name: "setTaskStatus",
    description: "Sets the status of a task",
    parameters: [
      {
        name: "id",
        type: "number",
        description: "The id of the task",
        required: true,
      },
      {
        name: "status",
        type: "string",
        description: "The status of the task",
        enum: Object.values(TaskStatus),
        required: true,
      },
    ],
    handler: ({ id, status }) => {
      setTaskStatus(id, status);
    },
  });

  useCopilotAction({
    name: "reorderTasks",
    description: "Reorders tasks by moving one task to another position",
    parameters: [
      {
        name: "activeId",
        type: "number",
        description: "The id of the task being moved",
        required: true,
      },
      {
        name: "overId",
        type: "number",
        description: "The id of the task to move over",
        required: true,
      },
    ],
    handler: ({ activeId, overId }) => {
      reorderTasks(activeId, overId);
    },
  });

  useCopilotReadable({
    description: "The state of the todo List",
    value: JSON.stringify(tasks),
  });

  const addTask = (title: string) => {
    const maxOrder = Math.max(...tasks.map(t => t.order), 0);
    setTasks([...tasks, { id: nextId++, title, status: TaskStatus.todo, order: maxOrder + 1 }]);
  };

  const setTaskStatus = (id: number, status: TaskStatus) => {
    setTasks(
      tasks.map((task) => (task.id === id ? { ...task, status } : task))
    );
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const reorderTasks = (activeId: number, overId: number) => {
    if (activeId === overId) return;
    
    console.log('Reordering tasks:', { activeId, overId });
    
    const sortedTasks = [...tasks].sort((a, b) => {
      if (a.status === b.status) {
        return a.order - b.order;
      }
      return a.status === TaskStatus.todo ? -1 : 1;
    });
    
    const activeIndex = sortedTasks.findIndex(task => task.id === activeId);
    const overIndex = sortedTasks.findIndex(task => task.id === overId);
    
    if (activeIndex === -1 || overIndex === -1) return;
    
    const [reorderedItem] = sortedTasks.splice(activeIndex, 1);
    sortedTasks.splice(overIndex, 0, reorderedItem);
    
    const updatedTasks = sortedTasks.map((task, index) => ({
      ...task,
      order: index + 1
    }));
    
    setTasks(updatedTasks);
  };

  return (
    <TasksContext.Provider
      value={{ tasks, addTask, setTaskStatus, deleteTask, reorderTasks }}
    >
      {children}
    </TasksContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TasksContext);
  if (context === undefined) {
    throw new Error("useTasks must be used within a TasksProvider");
  }
  return context;
};
