// interface of task
export interface Task {
  id: string;
  title: string;
  description: string;
  created_at?: string;
  completed?: boolean;
  completed_at?: string | null;
}

// interface of new task data
export interface NewTaskData {
  title: string;
  description: string;
}
