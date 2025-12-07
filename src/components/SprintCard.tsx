import { Sprint } from '@/types';
import { useTaskContext } from '@/context/TaskContext';
import { Target, Calendar, CheckCircle2, Clock } from 'lucide-react';
import { format, differenceInDays, isAfter } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

interface SprintCardProps {
  sprint: Sprint;
  onClick: () => void;
}

export function SprintCard({ sprint, onClick }: SprintCardProps) {
  const { tasks } = useTaskContext();

  const sprintTasks = tasks.filter((t) => sprint.taskIds.includes(t.id));
  const completedTasks = sprintTasks.filter((t) => t.status === 'done').length;
  const progress = sprintTasks.length > 0 ? (completedTasks / sprintTasks.length) * 100 : 0;

  const today = new Date();
  const endDate = new Date(sprint.endDate);
  const daysRemaining = differenceInDays(endDate, today);
  const isOverdue = isAfter(today, endDate);

  const statusColors = {
    active: 'border-primary bg-primary/5',
    completed: 'border-success bg-success/5',
    planning: 'border-muted bg-muted/30',
  };

  const statusLabels = {
    active: 'Ativo',
    completed: 'Concluído',
    planning: 'Planejamento',
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        'cursor-pointer rounded-xl border-2 p-5 transition-all hover:shadow-md',
        statusColors[sprint.status]
      )}
    >
      <div className="mb-4 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Target className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-foreground">{sprint.name}</h3>
          </div>
          <span className={cn(
            'inline-block rounded-full px-2 py-0.5 text-xs font-medium',
            sprint.status === 'active' && 'bg-primary/10 text-primary',
            sprint.status === 'completed' && 'bg-success/10 text-success',
            sprint.status === 'planning' && 'bg-muted text-muted-foreground'
          )}>
            {statusLabels[sprint.status]}
          </span>
        </div>
        {sprint.status === 'active' && (
          <div className={cn(
            'flex items-center gap-1 text-sm',
            isOverdue ? 'text-destructive' : 'text-muted-foreground'
          )}>
            <Clock className="h-4 w-4" />
            {isOverdue ? 'Atrasado' : `${daysRemaining}d restantes`}
          </div>
        )}
      </div>

      {sprint.goal && (
        <p className="mb-4 text-sm text-muted-foreground line-clamp-2">{sprint.goal}</p>
      )}

      <div className="mb-4">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Progresso</span>
          <span className="font-medium text-foreground">
            {completedTasks}/{sprintTasks.length} tarefas
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <Calendar className="h-3.5 w-3.5" />
          {format(new Date(sprint.startDate), 'dd MMM', { locale: ptBR })} -{' '}
          {format(endDate, 'dd MMM', { locale: ptBR })}
        </div>
        <div className="flex items-center gap-1">
          <CheckCircle2 className="h-3.5 w-3.5" />
          {Math.round(progress)}%
        </div>
      </div>
    </div>
  );
}
