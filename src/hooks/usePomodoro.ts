import { useState, useEffect, useCallback, useRef } from 'react';
import { useTaskContext } from '@/context/TaskContext';
import { generateId } from '@/lib/storage';

type TimerPhase = 'work' | 'short-break' | 'long-break';

export function usePomodoro() {
  const { pomodoroSettings, dispatch } = useTaskContext();
  const [timeLeft, setTimeLeft] = useState(pomodoroSettings.workDuration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [phase, setPhase] = useState<TimerPhase>('work');
  const [sessionsCompleted, setSessions] = useState(0);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [totalTime, setTotalTime] = useState(pomodoroSettings.workDuration * 60);
  const startTimeRef = useRef<number | null>(null);
  const elapsedRef = useRef(0);

  const getDuration = useCallback((p: TimerPhase) => {
    switch (p) {
      case 'work':
        return pomodoroSettings.workDuration * 60;
      case 'short-break':
        return pomodoroSettings.shortBreakDuration * 60;
      case 'long-break':
        return pomodoroSettings.longBreakDuration * 60;
    }
  }, [pomodoroSettings]);

  useEffect(() => {
    if (!isRunning) {
      setTotalTime(getDuration(phase));
      setTimeLeft(getDuration(phase));
    }
  }, [pomodoroSettings, phase, isRunning, getDuration]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
        if (phase === 'work' && selectedTaskId) {
          elapsedRef.current += 1;
        }
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);

      if (phase === 'work') {
        if (selectedTaskId && elapsedRef.current > 0) {
          dispatch({
            type: 'ADD_POMODORO_TIME_TO_TASK',
            payload: { taskId: selectedTaskId, seconds: elapsedRef.current },
          });
        }

        dispatch({
          type: 'ADD_POMODORO_SESSION',
          payload: {
            id: generateId(),
            taskId: selectedTaskId || undefined,
            type: 'work',
            duration: getDuration('work'),
            completedAt: new Date().toISOString(),
          },
        });

        const newSessions = sessionsCompleted + 1;
        setSessions(newSessions);

        if (newSessions % pomodoroSettings.sessionsBeforeLongBreak === 0) {
          setPhase('long-break');
          setTimeLeft(getDuration('long-break'));
          setTotalTime(getDuration('long-break'));
        } else {
          setPhase('short-break');
          setTimeLeft(getDuration('short-break'));
          setTotalTime(getDuration('short-break'));
        }
      } else {
        setPhase('work');
        setTimeLeft(getDuration('work'));
        setTotalTime(getDuration('work'));
      }

      elapsedRef.current = 0;
      startTimeRef.current = null;

      if (pomodoroSettings.soundEnabled) {
        try {
          const audio = new Audio('/notification.mp3');
          audio.play().catch(() => {});
        } catch {}
      }
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, phase, sessionsCompleted, selectedTaskId, pomodoroSettings, dispatch, getDuration]);

  const start = useCallback(() => {
    setIsRunning(true);
    startTimeRef.current = Date.now();
  }, []);

  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const reset = useCallback(() => {
    setIsRunning(false);
    setPhase('work');
    setTimeLeft(getDuration('work'));
    setTotalTime(getDuration('work'));
    elapsedRef.current = 0;
    startTimeRef.current = null;
  }, [getDuration]);

  const skipPhase = useCallback(() => {
    setIsRunning(false);
    if (phase === 'work') {
      const newSessions = sessionsCompleted + 1;
      setSessions(newSessions);
      if (newSessions % pomodoroSettings.sessionsBeforeLongBreak === 0) {
        setPhase('long-break');
        setTimeLeft(getDuration('long-break'));
        setTotalTime(getDuration('long-break'));
      } else {
        setPhase('short-break');
        setTimeLeft(getDuration('short-break'));
        setTotalTime(getDuration('short-break'));
      }
    } else {
      setPhase('work');
      setTimeLeft(getDuration('work'));
      setTotalTime(getDuration('work'));
    }
    elapsedRef.current = 0;
  }, [phase, sessionsCompleted, pomodoroSettings.sessionsBeforeLongBreak, getDuration]);

  const selectTask = useCallback((taskId: string | null) => {
    setSelectedTaskId(taskId);
  }, []);

  return {
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
    progress: ((totalTime - timeLeft) / totalTime) * 100,
  };
}
