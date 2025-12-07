import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, SkipForward, Settings } from 'lucide-react';
import { usePomodoro } from '@/hooks/usePomodoro';
import { useTaskContext } from '@/context/TaskContext';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface PomodoroTimerProps {
  compact?: boolean;
}

export function PomodoroTimer({ compact = false }: PomodoroTimerProps) {
  const {
    timeLeft,
    totalTime,
    isRunning,
    phase,
    sessionsCompleted,
    selectedTaskId,
    start,
    pause,
    reset,
    skipPhase,
    selectTask,
    progress,
  } = usePomodoro();
  const { tasks } = useTaskContext();

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const phaseLabels = {
    work: 'Foco',
    'short-break': 'Pausa Curta',
    'long-break': 'Pausa Longa',
  };

  const phaseColors = {
    work: 'text-primary',
    'short-break': 'text-success',
    'long-break': 'text-info',
  };

  const circumference = 2 * Math.PI * 90;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const incompleteTasks = tasks.filter((t) => t.status !== 'done');

  if (compact) {
    return (
      <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-4">
        <div className="relative h-16 w-16">
          <svg className="h-full w-full" viewBox="0 0 200 200">
            <circle
              cx="100"
              cy="100"
              r="90"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-muted"
            />
            <circle
              cx="100"
              cy="100"
              r="90"
              fill="none"
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="timer-ring"
              style={{ transition: 'stroke-dashoffset 1s linear' }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-mono text-sm font-medium text-foreground">
              {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
            </span>
          </div>
        </div>
        <div className="flex-1">
          <p className={cn('text-sm font-medium', phaseColors[phase])}>{phaseLabels[phase]}</p>
          <p className="text-xs text-muted-foreground">{sessionsCompleted} sessões hoje</p>
        </div>
        <Button
          variant={isRunning ? 'secondary' : 'default'}
          size="sm"
          onClick={isRunning ? pause : start}
        >
          {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div className="relative mb-8">
        <svg className="h-64 w-64" viewBox="0 0 200 200">
          <circle
            cx="100"
            cy="100"
            r="90"
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            className="text-muted"
          />
          <motion.circle
            cx="100"
            cy="100"
            r="90"
            fill="none"
            strokeWidth="6"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="timer-ring"
            initial={false}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1, ease: 'linear' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn('text-sm font-medium mb-1', phaseColors[phase])}>
            {phaseLabels[phase]}
          </span>
          <span className="font-mono text-5xl font-bold text-foreground">
            {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
          </span>
          <span className="text-sm text-muted-foreground mt-2">
            Sessão {sessionsCompleted + 1}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-8">
        <Button variant="secondary" size="icon" onClick={reset}>
          <RotateCcw className="h-5 w-5" />
        </Button>
        <Button
          size="lg"
          className="h-14 w-14 rounded-full"
          onClick={isRunning ? pause : start}
        >
          {isRunning ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-1" />}
        </Button>
        <Button variant="secondary" size="icon" onClick={skipPhase}>
          <SkipForward className="h-5 w-5" />
        </Button>
      </div>

      <div className="w-full max-w-xs">
        <label className="text-sm font-medium text-foreground mb-2 block">
          Tarefa em Foco
        </label>
        <Select value={selectedTaskId || 'none'} onValueChange={(v) => selectTask(v === 'none' ? null : v)}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione uma tarefa" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Nenhuma tarefa</SelectItem>
            {incompleteTasks.map((task) => (
              <SelectItem key={task.id} value={task.id}>
                {task.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
