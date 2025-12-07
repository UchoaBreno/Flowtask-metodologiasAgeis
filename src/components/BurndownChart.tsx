import { Sprint } from '@/types';
import { useTaskContext } from '@/context/TaskContext';
import { differenceInDays, addDays, format, isBefore, startOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface BurndownChartProps {
  sprint: Sprint;
}

export function BurndownChart({ sprint }: BurndownChartProps) {
  const { tasks } = useTaskContext();

  const sprintTasks = tasks.filter((t) => sprint.taskIds.includes(t.id));
  const totalTasks = sprintTasks.length;
  const completedTasks = sprintTasks.filter((t) => t.status === 'done').length;
  const remainingTasks = totalTasks - completedTasks;

  const startDate = startOfDay(new Date(sprint.startDate));
  const endDate = startOfDay(new Date(sprint.endDate));
  const today = startOfDay(new Date());
  const totalDays = differenceInDays(endDate, startDate);
  const daysElapsed = Math.min(differenceInDays(today, startDate), totalDays);

  // Generate ideal line points
  const idealLinePoints = [];
  for (let i = 0; i <= totalDays; i++) {
    const remaining = totalTasks - (totalTasks / totalDays) * i;
    idealLinePoints.push({
      day: i,
      remaining: Math.max(0, remaining),
      date: addDays(startDate, i),
    });
  }

  // SVG dimensions
  const width = 100;
  const height = 60;
  const padding = 5;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  const getX = (day: number) => padding + (day / totalDays) * chartWidth;
  const getY = (remaining: number) =>
    padding + chartHeight - (remaining / Math.max(totalTasks, 1)) * chartHeight;

  // Generate ideal line path
  const idealPath = idealLinePoints
    .map((point, i) => `${i === 0 ? 'M' : 'L'} ${getX(point.day)} ${getY(point.remaining)}`)
    .join(' ');

  // Actual progress point
  const actualX = getX(daysElapsed);
  const actualY = getY(remainingTasks);

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h3 className="mb-4 font-semibold text-foreground">Burndown Chart</h3>
      
      <div className="relative">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-40">
          {/* Grid lines */}
          <line
            x1={padding}
            y1={padding}
            x2={padding}
            y2={height - padding}
            stroke="currentColor"
            strokeWidth="0.3"
            className="text-border"
          />
          <line
            x1={padding}
            y1={height - padding}
            x2={width - padding}
            y2={height - padding}
            stroke="currentColor"
            strokeWidth="0.3"
            className="text-border"
          />

          {/* Ideal line */}
          <path
            d={idealPath}
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
            strokeDasharray="2,2"
            className="text-muted-foreground"
          />

          {/* Actual progress line */}
          <line
            x1={padding}
            y1={getY(totalTasks)}
            x2={actualX}
            y2={actualY}
            stroke="currentColor"
            strokeWidth="1"
            className="text-primary"
          />

          {/* Actual progress point */}
          <circle
            cx={actualX}
            cy={actualY}
            r="2"
            fill="currentColor"
            className="text-primary"
          />
        </svg>

        {/* Legend */}
        <div className="mt-4 flex items-center justify-center gap-6 text-xs">
          <div className="flex items-center gap-2">
            <div className="h-0.5 w-4 border-t-2 border-dashed border-muted-foreground" />
            <span className="text-muted-foreground">Ideal</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-0.5 w-4 bg-primary" />
            <span className="text-muted-foreground">Real</span>
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-2xl font-bold text-foreground">{totalTasks}</p>
          <p className="text-xs text-muted-foreground">Total</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-success">{completedTasks}</p>
          <p className="text-xs text-muted-foreground">Concluídas</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-warning">{remainingTasks}</p>
          <p className="text-xs text-muted-foreground">Restantes</p>
        </div>
      </div>
    </div>
  );
}
