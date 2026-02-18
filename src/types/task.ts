export type Priority = 'high' | 'medium' | 'low' | 'none';
export type Status = 'todo' | 'in_progress' | 'done';

export interface Task {
  id: string;
  title: string;
  description: string;
  date: string; // YYYY-MM-DD
  priority: Priority;
  status: Status;
  createdAt: string;
}

export const PRIORITY_LABELS: Record<Priority, string> = {
  high: 'High',
  medium: 'Medium',
  low: 'Low',
  none: 'None',
};

export const STATUS_LABELS: Record<Status, string> = {
  todo: 'To Do',
  in_progress: 'In Progress',
  done: 'Done',
};
