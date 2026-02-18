import { Task, STATUS_LABELS, PRIORITY_LABELS, Status } from '@/types/task';
import { Check, Circle, Clock, Trash2, GripVertical } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface TaskListProps {
  tasks: Task[];
  selectedDate: string | null;
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onDeleteTask: (id: string) => void;
  onEditTask: (task: Task) => void;
  statusFilter: Status | 'all';
  onStatusFilterChange: (s: Status | 'all') => void;
}

const statusIcon: Record<Status, React.ReactNode> = {
  todo: <Circle className="h-3.5 w-3.5 text-status-todo" />,
  in_progress: <Clock className="h-3.5 w-3.5 text-status-progress" />,
  done: <Check className="h-3.5 w-3.5 text-status-done" />,
};

const priorityColor: Record<string, string> = {
  high: 'border-priority-high/40 text-priority-high',
  medium: 'border-priority-medium/40 text-priority-medium',
  low: 'border-priority-low/40 text-priority-low',
  none: 'border-priority-none/40 text-priority-none',
};

const nextStatus: Record<Status, Status> = {
  todo: 'in_progress',
  in_progress: 'done',
  done: 'todo',
};

export default function TaskList({
  tasks,
  selectedDate,
  onUpdateTask,
  onDeleteTask,
  onEditTask,
  statusFilter,
  onStatusFilterChange,
}: TaskListProps) {
  const filteredTasks = tasks
    .filter(t => (selectedDate ? t.date === selectedDate : true))
    .filter(t => (statusFilter === 'all' ? true : t.status === statusFilter))
    .sort((a, b) => {
      const pOrder = { high: 0, medium: 1, low: 2, none: 3 };
      return pOrder[a.priority] - pOrder[b.priority];
    });

  return (
    <div className="flex flex-col h-full">
      {/* Filters */}
      <div className="flex items-center gap-1.5 mb-4 flex-wrap">
        {(['all', 'todo', 'in_progress', 'done'] as const).map(s => (
          <button
            key={s}
            onClick={() => onStatusFilterChange(s)}
            className={`text-xs font-display px-2.5 py-1 rounded-md transition-colors ${
              statusFilter === s
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
            }`}
          >
            {s === 'all' ? 'All' : STATUS_LABELS[s]}
          </button>
        ))}
      </div>

      {/* Task list */}
      <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
        {filteredTasks.length === 0 && (
          <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
            <p className="text-sm">No tasks found</p>
            <p className="text-xs mt-1">Click a date to add one</p>
          </div>
        )}
        {filteredTasks.map(task => (
          <div
            key={task.id}
            className="group glass-panel p-3 animate-fade-in cursor-pointer hover:border-primary/30 transition-all"
            onClick={() => onEditTask(task)}
          >
            <div className="flex items-start gap-2">
              <button
                onClick={e => {
                  e.stopPropagation();
                  onUpdateTask(task.id, { status: nextStatus[task.status] });
                }}
                className="mt-0.5 shrink-0 hover:scale-110 transition-transform"
              >
                {statusIcon[task.status]}
              </button>
              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm font-medium leading-tight ${
                    task.status === 'done' ? 'line-through text-muted-foreground' : ''
                  }`}
                >
                  {task.title}
                </p>
                {task.description && (
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">
                    {task.description}
                  </p>
                )}
                <div className="flex items-center gap-1.5 mt-1.5">
                  <span
                    className={`text-[10px] font-display border rounded px-1.5 py-0.5 ${priorityColor[task.priority]}`}
                  >
                    {PRIORITY_LABELS[task.priority]}
                  </span>
                  <span className="text-[10px] text-muted-foreground font-display">
                    {task.date}
                  </span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                onClick={e => {
                  e.stopPropagation();
                  onDeleteTask(task.id);
                }}
              >
                <Trash2 className="h-3 w-3 text-destructive" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
