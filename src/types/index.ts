export type Priority = 'low' | 'medium' | 'high';

export type TaskStatus = 'todo' | 'in-progress' | 'done';

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  deadline?: string;
  tags: string[];
  status: TaskStatus;
  pomodoroTime: number; // in seconds
  createdAt: string;
  updatedAt: string;
}

export interface Column {
  id: TaskStatus;
  title: string;
  tasks: Task[];
}

export interface PomodoroSettings {
  workDuration: number; // in minutes
  shortBreakDuration: number;
  longBreakDuration: number;
  sessionsBeforeLongBreak: number;
  soundEnabled: boolean;
}

export interface PomodoroSession {
  id: string;
  taskId?: string;
  taskTitle?: string;
  type: 'work' | 'short-break' | 'long-break';
  duration: number;
  completedAt: string;
}

export interface Sprint {
  id: string;
  name: string;
  goal: string;
  durationDays: number;
  startDate: string;
  endDate: string;
  taskIds: string[];
  status: 'active' | 'completed' | 'planning';
  retrospective?: {
    whatWorked: string;
    whatToImprove: string;
    actionItems: string;
  };
  createdAt: string;
}

export interface AppData {
  tasks: Task[];
  pomodoroSettings: PomodoroSettings;
  pomodoroSessions: PomodoroSession[];
  sprints: Sprint[];
  theme: 'light' | 'dark';
}
