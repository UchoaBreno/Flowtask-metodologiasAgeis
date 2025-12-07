import { PomodoroTimer } from '@/components/PomodoroTimer';
import { PomodoroSettings } from '@/components/PomodoroSettings';
import { useTaskContext } from '@/context/TaskContext';
import { Clock, TrendingUp, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function Pomodoro() {
  const { pomodoroSessions, tasks, getTodaySessions } = useTaskContext();

  const todaySessions = getTodaySessions();
  const totalFocusTime = todaySessions.reduce((acc, s) => acc + s.duration, 0);
  const focusHours = Math.floor(totalFocusTime / 3600);
  const focusMinutes = Math.floor((totalFocusTime % 3600) / 60);

  // Get recent sessions for history
  const recentSessions = pomodoroSessions
    .filter((s) => s.type === 'work')
    .slice(-10)
    .reverse();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Pomodoro Timer</h1>
          <p className="text-muted-foreground">Mantenha o foco com sessões cronometradas</p>
        </div>
        <PomodoroSettings />
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-border bg-card p-8 flex flex-col items-center">
            <PomodoroTimer />
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold text-card-foreground mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Estatísticas de Hoje
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Sessões concluídas</span>
                <span className="text-xl font-bold text-foreground">{todaySessions.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Tempo focado</span>
                <span className="text-xl font-bold text-foreground">
                  {focusHours > 0 ? `${focusHours}h ${focusMinutes}m` : `${focusMinutes}m`}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold text-card-foreground mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Histórico Recente
            </h2>
            {recentSessions.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">
                Nenhuma sessão concluída ainda
              </p>
            ) : (
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {recentSessions.map((session) => {
                  const task = session.taskId ? tasks.find((t) => t.id === session.taskId) : null;
                  return (
                    <div
                      key={session.id}
                      className="flex items-center gap-3 rounded-lg bg-secondary/50 p-3"
                    >
                      <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {task?.title || 'Sessão livre'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(session.completedAt), "dd MMM 'às' HH:mm", { locale: ptBR })}
                        </p>
                      </div>
                      <span className="text-sm text-muted-foreground shrink-0">
                        {Math.round(session.duration / 60)}m
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="rounded-xl border border-border bg-gradient-to-br from-primary/10 to-primary/5 p-6">
            <h3 className="font-semibold text-foreground mb-2">Dica</h3>
            <p className="text-sm text-muted-foreground">
              Selecione uma tarefa antes de iniciar o timer para registrar automaticamente o tempo
              focado em cada atividade.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
