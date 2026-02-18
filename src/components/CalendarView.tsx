import { useMemo } from 'react';
import { Task } from '@/types/task';
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isToday,
  addMonths,
  subMonths,
} from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CalendarViewProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
  tasks: Task[];
}

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const priorityDotColor: Record<string, string> = {
  high: 'bg-priority-high',
  medium: 'bg-priority-medium',
  low: 'bg-priority-low',
  none: 'bg-priority-none',
};

export default function CalendarView({
  currentDate,
  onDateChange,
  selectedDate,
  onSelectDate,
  tasks,
}: CalendarViewProps) {
  const days = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const calStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    const calEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
    return eachDayOfInterval({ start: calStart, end: calEnd });
  }, [currentDate]);

  const tasksByDate = useMemo(() => {
    const map: Record<string, Task[]> = {};
    tasks.forEach(t => {
      if (!map[t.date]) map[t.date] = [];
      map[t.date].push(t);
    });
    return map;
  }, [tasks]);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-display font-bold tracking-tight">
          {format(currentDate, 'MMMM yyyy')}
        </h2>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDateChange(subMonths(currentDate, 1))}
            className="h-8 w-8"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDateChange(new Date())}
            className="text-xs font-display"
          >
            Today
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDateChange(addMonths(currentDate, 1))}
            className="h-8 w-8"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 mb-1">
        {WEEKDAYS.map(d => (
          <div key={d} className="text-center text-xs font-display text-muted-foreground py-2">
            {d}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 flex-1 gap-px">
        {days.map(day => {
          const dateStr = format(day, 'yyyy-MM-dd');
          const dayTasks = tasksByDate[dateStr] || [];
          const inMonth = isSameMonth(day, currentDate);
          const today = isToday(day);
          const isSelected = selectedDate === dateStr;

          return (
            <button
              key={dateStr}
              onClick={() => onSelectDate(dateStr)}
              className={`calendar-cell text-left cursor-pointer ${
                !inMonth ? 'calendar-cell-other' : ''
              } ${today ? 'calendar-cell-today' : ''} ${
                isSelected ? 'ring-1 ring-primary bg-primary/10' : ''
              }`}
            >
              <span
                className={`text-xs font-display mb-1 ${
                  today
                    ? 'bg-primary text-primary-foreground w-5 h-5 rounded-full flex items-center justify-center'
                    : 'text-muted-foreground'
                }`}
              >
                {format(day, 'd')}
              </span>
              {dayTasks.length > 0 && (
                <div className="flex flex-wrap gap-0.5 mt-auto">
                  {dayTasks.slice(0, 3).map(t => (
                    <span key={t.id} className={`task-dot ${priorityDotColor[t.priority]}`} />
                  ))}
                  {dayTasks.length > 3 && (
                    <span className="text-[9px] text-muted-foreground font-display">
                      +{dayTasks.length - 3}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
