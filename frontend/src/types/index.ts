// type of task
export interface Task {
  id: string;
  title: string;
  description: string;
  created_at?: string;
  completed?: boolean;
  completed_at?: string | null;
}

// type of new task data
export interface NewTaskData {
  title: string;
  description: string;
}
