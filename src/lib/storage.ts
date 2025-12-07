import { AppData, Task, PomodoroSettings, PomodoroSession, Sprint } from '@/types';

const STORAGE_KEY = 'productivity-app-data';

const defaultPomodoroSettings: PomodoroSettings = {
  workDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  sessionsBeforeLongBreak: 4,
  soundEnabled: true,
};

const defaultData: AppData = {
  tasks: [],
  pomodoroSettings: defaultPomodoroSettings,
  pomodoroSessions: [],
  sprints: [],
  theme: 'light',
};

export function loadData(): AppData {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        ...defaultData,
        ...parsed,
        pomodoroSettings: { ...defaultPomodoroSettings, ...parsed.pomodoroSettings },
      };
    }
  } catch (error) {
    console.error('Error loading data:', error);
  }
  return defaultData;
}

export function saveData(data: Partial<AppData>): void {
  try {
    const current = loadData();
    const updated = { ...current, ...data };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Error saving data:', error);
  }
}

export function saveTasks(tasks: Task[]): void {
  saveData({ tasks });
}

export function savePomodoroSettings(settings: PomodoroSettings): void {
  saveData({ pomodoroSettings: settings });
}

export function savePomodoroSession(session: PomodoroSession): void {
  const current = loadData();
  const sessions = [...current.pomodoroSessions, session];
  saveData({ pomodoroSessions: sessions });
}

export function saveSprints(sprints: Sprint[]): void {
  saveData({ sprints });
}

export function saveTheme(theme: 'light' | 'dark'): void {
  saveData({ theme });
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
