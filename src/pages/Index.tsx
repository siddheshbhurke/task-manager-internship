import { useState } from 'react';
import { format } from 'date-fns';
import { Plus, Calendar, ListTodo } from 'lucide-react';
import { useTasks } from '@/hooks/useTasks';
import CalendarView from '@/components/CalendarView';
import TaskList from '@/components/TaskList';
import TaskForm from '@/components/TaskForm';
import { Task, Status } from '@/types/task';
import { Button } from '@/components/ui/button';

const Index = () => {
  const { tasks, addTask, updateTask, deleteTask } = useTasks();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(
    format(new Date(), 'yyyy-MM-dd')
  );
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [statusFilter, setStatusFilter] = useState<Status | 'all'>('all');

  const handleAddTask = (task: Omit<Task, 'id' | 'createdAt'>) => {
    addTask(task);
    setShowForm(false);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingTask(null);
  };

  const totalTasks = tasks.length;
  const doneTasks = tasks.filter(t => t.status === 'done').length;

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      {/* Top bar */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <ListTodo className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h1 className="text-base font-display font-bold tracking-tight">Taskflow</h1>
            <p className="text-[11px] text-muted-foreground font-display">
              {doneTasks}/{totalTasks} completed
            </p>
          </div>
        </div>
        <Button
          size="sm"
          className="font-display text-xs gap-1.5"
          onClick={() => {
            setEditingTask(null);
            setShowForm(true);
          }}
        >
          <Plus className="h-3.5 w-3.5" />
          New Task
        </Button>
      </header>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Calendar */}
        <div className="flex-1 p-6 overflow-auto">
          <CalendarView
            currentDate={currentDate}
            onDateChange={setCurrentDate}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            tasks={tasks}
          />
        </div>

        {/* Sidebar */}
        <div className="w-80 border-l border-border p-4 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display font-semibold text-sm">
              {selectedDate
                ? format(new Date(selectedDate + 'T00:00:00'), 'MMM d, yyyy')
                : 'All Tasks'}
            </h2>
            {selectedDate && (
              <button
                onClick={() => setSelectedDate(null)}
                className="text-[10px] font-display text-muted-foreground hover:text-foreground transition-colors"
              >
                Show all
              </button>
            )}
          </div>

          {/* Form */}
          {showForm && (
            <div className="mb-3">
              <TaskForm
                initialTask={editingTask}
                selectedDate={selectedDate || format(new Date(), 'yyyy-MM-dd')}
                onSubmit={handleAddTask}
                onUpdate={updateTask}
                onClose={handleCloseForm}
              />
            </div>
          )}

          {/* Tasks */}
          <div className="flex-1 overflow-hidden">
            <TaskList
              tasks={tasks}
              selectedDate={selectedDate}
              onUpdateTask={updateTask}
              onDeleteTask={deleteTask}
              onEditTask={handleEditTask}
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
