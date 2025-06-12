import { Task, TaskStatus } from "./tasks.types";

export const defaultTasks: Task[] = [
  {
    id: 1,
    title: "Complete project proposal",
    status: TaskStatus.done,
    order: 1,
  },
  {
    id: 2,
    title: "Review design mockups",
    status: TaskStatus.done,
    order: 2,
  },
  {
    id: 3,
    title: "Prepare presentation slides",
    status: TaskStatus.todo,
    order: 3,
  },
  {
    id: 4,
    title: "Send meeting notes email",
    status: TaskStatus.todo,
    order: 4,
  },
  {
    id: 5,
    title: "Review Uli's pull request",
    status: TaskStatus.todo,
    order: 5,
  },
];