import { useState } from 'react';
import { useTaskContext } from '@/context/TaskContext';
import { Settings, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

export function PomodoroSettings() {
  const { pomodoroSettings, dispatch } = useTaskContext();
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState(pomodoroSettings);

  const handleSave = () => {
    dispatch({ type: 'UPDATE_POMODORO_SETTINGS', payload: settings });
    setIsOpen(false);
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => {
          setSettings(pomodoroSettings);
          setIsOpen(true);
        }}
      >
        <Settings className="h-5 w-5" />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-foreground/20 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl border border-border bg-card p-6 shadow-lg"
            >
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-card-foreground">
                  Configurações do Timer
                </h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="work">Foco (min)</Label>
                    <Input
                      id="work"
                      type="number"
                      min={1}
                      max={120}
                      value={settings.workDuration}
                      onChange={(e) =>
                        setSettings({ ...settings, workDuration: parseInt(e.target.value) || 25 })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="short">Pausa Curta</Label>
                    <Input
                      id="short"
                      type="number"
                      min={1}
                      max={30}
                      value={settings.shortBreakDuration}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          shortBreakDuration: parseInt(e.target.value) || 5,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="long">Pausa Longa</Label>
                    <Input
                      id="long"
                      type="number"
                      min={1}
                      max={60}
                      value={settings.longBreakDuration}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          longBreakDuration: parseInt(e.target.value) || 15,
                        })
                      }
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="sessions">Sessões até pausa longa</Label>
                  <Input
                    id="sessions"
                    type="number"
                    min={2}
                    max={10}
                    value={settings.sessionsBeforeLongBreak}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        sessionsBeforeLongBreak: parseInt(e.target.value) || 4,
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="sound" className="cursor-pointer">
                    Sons de notificação
                  </Label>
                  <Switch
                    id="sound"
                    checked={settings.soundEnabled}
                    onCheckedChange={(checked) =>
                      setSettings({ ...settings, soundEnabled: checked })
                    }
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="secondary" onClick={() => setIsOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleSave}>Salvar</Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
