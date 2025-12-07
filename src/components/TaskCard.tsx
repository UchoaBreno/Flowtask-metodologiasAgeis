import { Task } from '@/types';
import { Calendar, Clock, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, isPast, isToday } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface TaskCardProps {
  task: Task;
  onClick: () => void;
  isDragging?: boolean;
}

export function TaskCard({ task, onClick, isDragging }: TaskCardProps) {
  const priorityColors = {
    low: 'bg-success/10 text-success border-success/20',
    medium: 'bg-warning/10 text-warning border-warning/20',
    high: 'bg-destructive/10 text-destructive border-destructive/20',
  };

  const priorityLabels = {
    low: 'Baixa',
    medium: 'Média',
    high: 'Alta',
  };

  const isOverdue = task.deadline && isPast(new Date(task.deadline)) && !isToday(new Date(task.deadline));
  const isDueToday = task.deadline && isToday(new Date(task.deadline));

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${mins}m`;
    return `${mins}m`;
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        'group cursor-pointer rounded-lg border border-border bg-card p-4 shadow-sm transition-all hover:shadow-md hover:border-primary/30',
        isDragging && 'shadow-lg rotate-2 scale-105'
      )}
    >
      <div className="mb-3 flex items-start justify-between gap-2">
        <h4 className="font-medium text-card-foreground line-clamp-2">{task.title}</h4>
        <span
          className={cn(
            'shrink-0 rounded-full border px-2 py-0.5 text-xs font-medium',
            priorityColors[task.priority]
          )}
        >
          {priorityLabels[task.priority]}
        </span>
      </div>

      {task.description && (
        <p className="mb-3 text-sm text-muted-foreground line-clamp-2">{task.description}</p>
      )}

      <div className="flex flex-wrap items-center gap-2 text-xs">
        {task.deadline && (
          <div
            className={cn(
              'flex items-center gap-1 rounded-md px-2 py-1',
              isOverdue
                ? 'bg-destructive/10 text-destructive'
                : isDueToday
                ? 'bg-warning/10 text-warning'
                : 'bg-secondary text-muted-foreground'
            )}
          >
            <Calendar className="h-3 w-3" />
            {format(new Date(task.deadline), 'dd MMM', { locale: ptBR })}
          </div>
        )}

        {task.pomodoroTime > 0 && (
          <div className="flex items-center gap-1 rounded-md bg-primary/10 px-2 py-1 text-primary">
            <Clock className="h-3 w-3" />
            {formatTime(task.pomodoroTime)}
          </div>
        )}

        {task.tags.length > 0 && (
          <div className="flex items-center gap-1">
            <Tag className="h-3 w-3 text-muted-foreground" />
            {task.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-secondary px-2 py-1 text-secondary-foreground"
              >
                {tag}
              </span>
            ))}
            {task.tags.length > 2 && (
              <span className="text-muted-foreground">+{task.tags.length - 2}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
