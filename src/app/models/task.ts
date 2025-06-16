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

export interface Todo {
  id: number;
  todo: string;
  completed: boolean;
  userId: number;
}
