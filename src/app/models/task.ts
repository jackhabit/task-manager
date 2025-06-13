export interface Task {
  id: number;
  todo: string;
  createdAt: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  deadline?: string;
}

export interface TaskList {
  title: string;
  tasks: Task[];
}
