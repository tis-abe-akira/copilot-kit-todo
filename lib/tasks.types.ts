export type Task = {
  id: number;
  title: string;
  status: TaskStatus;
  order: number;
};

export enum TaskStatus {
  todo = "todo",
  done = "done",
}
