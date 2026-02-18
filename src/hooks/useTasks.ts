import { useState, useCallback } from 'react';
import { Task, Status, Priority } from '@/types/task';

const generateId = () => Math.random().toString(36).substring(2, 10);

const SAMPLE_TASKS: Task[] = [
  {
    id: generateId(),
    title: 'Design system review',
    description: 'Review and update the design tokens for consistency',
    date: new Date().toISOString().split('T')[0],
    priority: 'high',
    status: 'in_progress',
    createdAt: new Date().toISOString(),
  },
  {
    id: generateId(),
    title: 'Sprint planning',
    description: 'Plan tasks for the upcoming sprint',
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    priority: 'medium',
    status: 'todo',
    createdAt: new Date().toISOString(),
  },
  {
    id: generateId(),
    title: 'Deploy v2.0',
    description: 'Push the latest release to production',
    date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    priority: 'high',
    status: 'todo',
    createdAt: new Date().toISOString(),
  },
  {
    id: generateId(),
    title: 'Write documentation',
    description: 'Update API docs with new endpoints',
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    priority: 'low',
    status: 'done',
    createdAt: new Date().toISOString(),
  },
];

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>(SAMPLE_TASKS);

  const addTask = useCallback((task: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...task,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    setTasks(prev => [newTask, ...prev]);
    return newTask;
  }, []);

  const updateTask = useCallback((id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => {
    setTasks(prev => prev.map(t => (t.id === id ? { ...t, ...updates } : t)));
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  }, []);

  const getTasksByDate = useCallback((date: string) => {
    return tasks.filter(t => t.date === date);
  }, [tasks]);

  return { tasks, addTask, updateTask, deleteTask, getTasksByDate };
}
