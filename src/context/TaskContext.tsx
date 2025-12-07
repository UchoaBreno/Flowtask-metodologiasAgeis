import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Task, Column, TaskStatus, PomodoroSettings, PomodoroSession, Sprint, AppData } from '@/types';
import { loadData, saveTasks, savePomodoroSettings, savePomodoroSession, saveSprints, saveTheme, generateId } from '@/lib/storage';

interface State {
  tasks: Task[];
  pomodoroSettings: PomodoroSettings;
  pomodoroSessions: PomodoroSession[];
  sprints: Sprint[];
  theme: 'light' | 'dark';
}

type Action =
  | { type: 'SET_INITIAL_DATA'; payload: AppData }
  | { type: 'ADD_TASK'; payload: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'pomodoroTime'> }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'MOVE_TASK'; payload: { taskId: string; newStatus: TaskStatus } }
  | { type: 'REORDER_TASKS'; payload: Task[] }
  | { type: 'UPDATE_POMODORO_SETTINGS'; payload: PomodoroSettings }
  | { type: 'ADD_POMODORO_SESSION'; payload: PomodoroSession }
  | { type: 'ADD_POMODORO_TIME_TO_TASK'; payload: { taskId: string; seconds: number } }
  | { type: 'ADD_SPRINT'; payload: Omit<Sprint, 'id' | 'createdAt'> }
  | { type: 'UPDATE_SPRINT'; payload: Sprint }
  | { type: 'DELETE_SPRINT'; payload: string }
  | { type: 'COMPLETE_SPRINT'; payload: string }
  | { type: 'TOGGLE_THEME' };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_INITIAL_DATA':
      return { ...state, ...action.payload };

    case 'ADD_TASK': {
      const newTask: Task = {
        ...action.payload,
        id: generateId(),
        pomodoroTime: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const tasks = [...state.tasks, newTask];
      saveTasks(tasks);
      return { ...state, tasks };
    }

    case 'UPDATE_TASK': {
      const tasks = state.tasks.map((t) =>
        t.id === action.payload.id
          ? { ...action.payload, updatedAt: new Date().toISOString() }
          : t
      );
      saveTasks(tasks);
      return { ...state, tasks };
    }

    case 'DELETE_TASK': {
      const tasks = state.tasks.filter((t) => t.id !== action.payload);
      saveTasks(tasks);
      return { ...state, tasks };
    }

    case 'MOVE_TASK': {
      const tasks = state.tasks.map((t) =>
        t.id === action.payload.taskId
          ? { ...t, status: action.payload.newStatus, updatedAt: new Date().toISOString() }
          : t
      );
      saveTasks(tasks);
      return { ...state, tasks };
    }

    case 'REORDER_TASKS': {
      saveTasks(action.payload);
      return { ...state, tasks: action.payload };
    }

    case 'UPDATE_POMODORO_SETTINGS':
      savePomodoroSettings(action.payload);
      return { ...state, pomodoroSettings: action.payload };

    case 'ADD_POMODORO_SESSION': {
      const sessions = [...state.pomodoroSessions, action.payload];
      savePomodoroSession(action.payload);
      return { ...state, pomodoroSessions: sessions };
    }

    case 'ADD_POMODORO_TIME_TO_TASK': {
      const tasks = state.tasks.map((t) =>
        t.id === action.payload.taskId
          ? { ...t, pomodoroTime: t.pomodoroTime + action.payload.seconds }
          : t
      );
      saveTasks(tasks);
      return { ...state, tasks };
    }

    case 'ADD_SPRINT': {
      const newSprint: Sprint = {
        ...action.payload,
        id: generateId(),
        createdAt: new Date().toISOString(),
      };
      const sprints = [...state.sprints, newSprint];
      saveSprints(sprints);
      return { ...state, sprints };
    }

    case 'UPDATE_SPRINT': {
      const sprints = state.sprints.map((s) =>
        s.id === action.payload.id ? action.payload : s
      );
      saveSprints(sprints);
      return { ...state, sprints };
    }

    case 'DELETE_SPRINT': {
      const sprints = state.sprints.filter((s) => s.id !== action.payload);
      saveSprints(sprints);
      return { ...state, sprints };
    }

    case 'COMPLETE_SPRINT': {
      const sprint = state.sprints.find((s) => s.id === action.payload);
      if (!sprint) return state;

      const tasks = state.tasks.map((t) =>
        sprint.taskIds.includes(t.id) ? { ...t, status: 'done' as TaskStatus } : t
      );
      const sprints = state.sprints.map((s) =>
        s.id === action.payload ? { ...s, status: 'completed' as const } : s
      );

      saveTasks(tasks);
      saveSprints(sprints);
      return { ...state, tasks, sprints };
    }

    case 'TOGGLE_THEME': {
      const theme = state.theme === 'light' ? 'dark' : 'light';
      saveTheme(theme);
      return { ...state, theme };
    }

    default:
      return state;
  }
}

interface TaskContextType extends State {
  dispatch: React.Dispatch<Action>;
  getColumns: () => Column[];
  getTaskById: (id: string) => Task | undefined;
  getActiveSprint: () => Sprint | undefined;
  getTodaySessions: () => PomodoroSession[];
}

const TaskContext = createContext<TaskContextType | null>(null);

export function TaskProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {
    tasks: [],
    pomodoroSettings: {
      workDuration: 25,
      shortBreakDuration: 5,
      longBreakDuration: 15,
      sessionsBeforeLongBreak: 4,
      soundEnabled: true,
    },
    pomodoroSessions: [],
    sprints: [],
    theme: 'light',
  });

  useEffect(() => {
    const data = loadData();
    dispatch({ type: 'SET_INITIAL_DATA', payload: data });
  }, []);

  useEffect(() => {
    if (state.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state.theme]);

  const getColumns = (): Column[] => {
    return [
      { id: 'todo', title: 'A Fazer', tasks: state.tasks.filter((t) => t.status === 'todo') },
      { id: 'in-progress', title: 'Em Progresso', tasks: state.tasks.filter((t) => t.status === 'in-progress') },
      { id: 'done', title: 'Concluído', tasks: state.tasks.filter((t) => t.status === 'done') },
    ];
  };

  const getTaskById = (id: string): Task | undefined => {
    return state.tasks.find((t) => t.id === id);
  };

  const getActiveSprint = (): Sprint | undefined => {
    return state.sprints.find((s) => s.status === 'active');
  };

  const getTodaySessions = (): PomodoroSession[] => {
    const today = new Date().toDateString();
    return state.pomodoroSessions.filter(
      (s) => new Date(s.completedAt).toDateString() === today && s.type === 'work'
    );
  };

  return (
    <TaskContext.Provider
      value={{
        ...state,
        dispatch,
        getColumns,
        getTaskById,
        getActiveSprint,
        getTodaySessions,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTaskContext() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within TaskProvider');
  }
  return context;
}
