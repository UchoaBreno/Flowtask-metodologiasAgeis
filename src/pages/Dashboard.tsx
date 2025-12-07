import { CheckCircle2, Clock, Target, ListTodo, TrendingUp } from 'lucide-react';
import { useTaskContext } from '@/context/TaskContext';
import { StatsCard } from '@/components/StatsCard';
import { PomodoroTimer } from '@/components/PomodoroTimer';
import { TaskCard } from '@/components/TaskCard';
import { SprintCard } from '@/components/SprintCard';
import { TaskModal } from '@/components/TaskModal';
import { SprintModal } from '@/components/SprintModal';
import { useState } from 'react';
import { Task, Sprint } from '@/types';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function Dashboard() {
  const { tasks, getActiveSprint, getTodaySessions, sprints } = useTaskContext();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedSprint, setSelectedSprint] = useState<Sprint | null>(null);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'done').length;
  const inProgressTasks = tasks.filter((t) => t.status === 'in-progress').length;
  const todaySessions = getTodaySessions();
  const activeSprint = getActiveSprint();

  const recentTasks = tasks
    .filter((t) => t.status !== 'done')
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 4);

  const totalFocusTime = todaySessions.reduce((acc, s) => acc + s.duration, 0);
  const focusHours = Math.floor(totalFocusTime / 3600);
  const focusMinutes = Math.floor((totalFocusTime % 3600) / 60);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Visão geral da sua produtividade</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatsCard
          title="Total de Tarefas"
          value={totalTasks}
          icon={<ListTodo className="h-6 w-6" />}
          description={`${inProgressTasks} em progresso`}
        />
        <StatsCard
          title="Concluídas"
          value={completedTasks}
          icon={<CheckCircle2 className="h-6 w-6" />}
          description={totalTasks > 0 ? `${Math.round((completedTasks / totalTasks) * 100)}% do total` : 'Nenhuma tarefa'}
        />
        <StatsCard
          title="Pomodoros Hoje"
          value={todaySessions.length}
          icon={<Clock className="h-6 w-6" />}
          description={focusHours > 0 ? `${focusHours}h ${focusMinutes}m focado` : `${focusMinutes}m focado`}
        />
        <StatsCard
          title="Sprint Ativo"
          value={activeSprint ? 1 : 0}
          icon={<Target className="h-6 w-6" />}
          description={activeSprint?.name || 'Nenhum sprint ativo'}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-card-foreground">Tarefas Recentes</h2>
              <Link to="/kanban">
                <Button variant="ghost" size="sm">
                  Ver todas
                </Button>
              </Link>
            </div>
            {recentTasks.length === 0 ? (
              <div className="text-center py-8">
                <ListTodo className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground">Nenhuma tarefa ainda</p>
                <Link to="/kanban">
                  <Button variant="secondary" size="sm" className="mt-4">
                    Criar primeira tarefa
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {recentTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onClick={() => setSelectedTask(task)}
                  />
                ))}
              </div>
            )}
          </div>

          {activeSprint && (
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-card-foreground">Sprint Ativo</h2>
                <Link to="/sprints">
                  <Button variant="ghost" size="sm">
                    Ver sprints
                  </Button>
                </Link>
              </div>
              <SprintCard sprint={activeSprint} onClick={() => setSelectedSprint(activeSprint)} />
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold text-card-foreground mb-4">Timer Rápido</h2>
            <PomodoroTimer compact />
            <Link to="/pomodoro" className="block mt-4">
              <Button variant="secondary" className="w-full">
                Abrir Timer Completo
              </Button>
            </Link>
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold text-card-foreground mb-4">Dica do Dia</h2>
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/20 text-accent">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-foreground font-medium">Técnica Pomodoro</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Trabalhe em blocos de 25 minutos com pausas curtas. Após 4 sessões, faça uma pausa longa.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <TaskModal
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        task={selectedTask}
      />
      <SprintModal
        isOpen={!!selectedSprint}
        onClose={() => setSelectedSprint(null)}
        sprint={selectedSprint}
      />
    </div>
  );
}
