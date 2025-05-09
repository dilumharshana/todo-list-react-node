// interface of task
// Define the Task interface
export interface Task {
  json(): unknown;
  ok: unknown;
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

// interface of new task data
export interface NewTaskData {
  title: string;
  description: string;
}
// interface of task list
export interface TaskListProps {
  refreshTrigger: number;
}
