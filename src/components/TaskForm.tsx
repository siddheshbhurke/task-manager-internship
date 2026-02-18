import { useState, useEffect } from 'react';
import { Task, Priority, Status, PRIORITY_LABELS, STATUS_LABELS } from '@/types/task';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { X } from 'lucide-react';

interface TaskFormProps {
  initialTask?: Task | null;
  selectedDate: string;
  onSubmit: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  onUpdate?: (id: string, updates: Partial<Task>) => void;
  onClose: () => void;
}

export default function TaskForm({ initialTask, selectedDate, onSubmit, onUpdate, onClose }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [status, setStatus] = useState<Status>('todo');
  const [date, setDate] = useState(selectedDate);

  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title);
      setDescription(initialTask.description);
      setPriority(initialTask.priority);
      setStatus(initialTask.status);
      setDate(initialTask.date);
    } else {
      setTitle('');
      setDescription('');
      setPriority('medium');
      setStatus('todo');
      setDate(selectedDate);
    }
  }, [initialTask, selectedDate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (initialTask && onUpdate) {
      onUpdate(initialTask.id, { title, description, priority, status, date });
    } else {
      onSubmit({ title, description, priority, status, date });
    }
    onClose();
  };

  return (
    <div className="glass-panel p-4 animate-slide-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-semibold text-sm">
          {initialTask ? 'Edit Task' : 'New Task'}
        </h3>
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onClose}>
          <X className="h-3.5 w-3.5" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          placeholder="Task title..."
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="bg-secondary/50 border-border font-body text-sm"
          autoFocus
        />
        <Textarea
          placeholder="Description (optional)"
          value={description}
          onChange={e => setDescription(e.target.value)}
          className="bg-secondary/50 border-border font-body text-sm resize-none h-16"
        />
        <Input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          className="bg-secondary/50 border-border font-display text-sm"
        />

        {/* Priority */}
        <div>
          <label className="text-xs text-muted-foreground font-display mb-1.5 block">Priority</label>
          <div className="flex gap-1">
            {(['high', 'medium', 'low', 'none'] as Priority[]).map(p => (
              <button
                key={p}
                type="button"
                onClick={() => setPriority(p)}
                className={`text-xs font-display px-2.5 py-1 rounded-md transition-colors ${
                  priority === p
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                }`}
              >
                {PRIORITY_LABELS[p]}
              </button>
            ))}
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="text-xs text-muted-foreground font-display mb-1.5 block">Status</label>
          <div className="flex gap-1">
            {(['todo', 'in_progress', 'done'] as Status[]).map(s => (
              <button
                key={s}
                type="button"
                onClick={() => setStatus(s)}
                className={`text-xs font-display px-2.5 py-1 rounded-md transition-colors ${
                  status === s
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                }`}
              >
                {STATUS_LABELS[s]}
              </button>
            ))}
          </div>
        </div>

        <Button type="submit" className="w-full font-display text-sm" size="sm">
          {initialTask ? 'Update Task' : 'Add Task'}
        </Button>
      </form>
    </div>
  );
}
