import { useState, useEffect } from 'react';
import { Sprint, Task } from '@/types';
import { X, Trash2, CheckCircle2, Calendar as CalendarIcon } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { useTaskContext } from '@/context/TaskContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface SprintModalProps {
  isOpen: boolean;
  onClose: () => void;
  sprint?: Sprint | null;
}

export function SprintModal({ isOpen, onClose, sprint }: SprintModalProps) {
  const { tasks, dispatch } = useTaskContext();
  const [name, setName] = useState('');
  const [goal, setGoal] = useState('');
  const [durationDays, setDurationDays] = useState(14);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([]);
  const [status, setStatus] = useState<Sprint['status']>('planning');
  const [retrospective, setRetrospective] = useState({
    whatWorked: '',
    whatToImprove: '',
    actionItems: '',
  });

  const incompleteTasks = tasks.filter((t) => t.status !== 'done');

  useEffect(() => {
    if (sprint) {
      setName(sprint.name);
      setGoal(sprint.goal);
      setDurationDays(sprint.durationDays);
      setStartDate(new Date(sprint.startDate));
      setSelectedTaskIds(sprint.taskIds);
      setStatus(sprint.status);
      setRetrospective(sprint.retrospective || { whatWorked: '', whatToImprove: '', actionItems: '' });
    } else {
      setName('');
      setGoal('');
      setDurationDays(14);
      setStartDate(new Date());
      setSelectedTaskIds([]);
      setStatus('planning');
      setRetrospective({ whatWorked: '', whatToImprove: '', actionItems: '' });
    }
  }, [sprint, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const endDate = addDays(startDate, durationDays);

    if (sprint) {
      dispatch({
        type: 'UPDATE_SPRINT',
        payload: {
          ...sprint,
          name: name.trim(),
          goal: goal.trim(),
          durationDays,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          taskIds: selectedTaskIds,
          status,
          retrospective: status === 'completed' ? retrospective : undefined,
        },
      });
      toast.success('Sprint atualizado com sucesso!');
    } else {
      dispatch({
        type: 'ADD_SPRINT',
        payload: {
          name: name.trim(),
          goal: goal.trim(),
          durationDays,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          taskIds: selectedTaskIds,
          status,
        },
      });
      toast.success('Sprint criado com sucesso!');
    }
    onClose();
  };

  const handleDelete = () => {
    if (sprint) {
      dispatch({ type: 'DELETE_SPRINT', payload: sprint.id });
      toast.success('Sprint excluído!');
      onClose();
    }
  };

  const handleCompleteSprint = () => {
    if (sprint) {
      dispatch({ type: 'COMPLETE_SPRINT', payload: sprint.id });
      toast.success('Sprint concluído com sucesso!');
      onClose();
    }
  };

  const toggleTask = (taskId: string) => {
    setSelectedTaskIds((prev) =>
      prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-foreground/20 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 m-auto h-fit w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl border border-border bg-card p-6 shadow-lg"
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-card-foreground">
                {sprint ? 'Editar Sprint' : 'Novo Sprint'}
              </h2>
              <button
                onClick={onClose}
                className="rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="sprintName">Nome do Sprint</Label>
                <Input
                  id="sprintName"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Sprint 1"
                  required
                />
              </div>

              <div>
                <Label htmlFor="sprintGoal">Meta do Sprint</Label>
                <Textarea
                  id="sprintGoal"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  placeholder="O que deseja alcançar neste sprint?"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Data de Início</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(startDate, 'PPP', { locale: ptBR })}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={(d) => d && setStartDate(d)}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Label>Duração (dias)</Label>
                  <Select
                    value={durationDays.toString()}
                    onValueChange={(v) => setDurationDays(parseInt(v))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">1 semana</SelectItem>
                      <SelectItem value="14">2 semanas</SelectItem>
                      <SelectItem value="21">3 semanas</SelectItem>
                      <SelectItem value="28">4 semanas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Status</Label>
                <Select value={status} onValueChange={(v) => setStatus(v as Sprint['status'])}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="planning">Planejamento</SelectItem>
                    <SelectItem value="active">Ativo</SelectItem>
                    <SelectItem value="completed">Concluído</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="mb-3 block">Tarefas do Sprint</Label>
                <div className="max-h-48 overflow-y-auto rounded-lg border border-border p-3 space-y-2">
                  {incompleteTasks.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      Nenhuma tarefa disponível
                    </p>
                  ) : (
                    incompleteTasks.map((task) => (
                      <label
                        key={task.id}
                        className="flex items-center gap-3 rounded-lg p-2 hover:bg-secondary cursor-pointer"
                      >
                        <Checkbox
                          checked={selectedTaskIds.includes(task.id)}
                          onCheckedChange={() => toggleTask(task.id)}
                        />
                        <span className="text-sm text-foreground">{task.title}</span>
                      </label>
                    ))
                  )}
                </div>
              </div>

              {sprint?.status === 'completed' && (
                <div className="space-y-4 pt-4 border-t border-border">
                  <h3 className="font-medium text-foreground">Retrospectiva</h3>
                  <div>
                    <Label>O que funcionou?</Label>
                    <Textarea
                      value={retrospective.whatWorked}
                      onChange={(e) => setRetrospective({ ...retrospective, whatWorked: e.target.value })}
                      rows={2}
                    />
                  </div>
                  <div>
                    <Label>O que pode melhorar?</Label>
                    <Textarea
                      value={retrospective.whatToImprove}
                      onChange={(e) => setRetrospective({ ...retrospective, whatToImprove: e.target.value })}
                      rows={2}
                    />
                  </div>
                  <div>
                    <Label>Ações para próximo sprint</Label>
                    <Textarea
                      value={retrospective.actionItems}
                      onChange={(e) => setRetrospective({ ...retrospective, actionItems: e.target.value })}
                      rows={2}
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-between pt-4">
                <div className="flex gap-2">
                  {sprint && (
                    <>
                      <Button type="button" variant="destructive" onClick={handleDelete}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Excluir
                      </Button>
                      {sprint.status === 'active' && (
                        <Button type="button" variant="secondary" onClick={handleCompleteSprint}>
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                          Concluir
                        </Button>
                      )}
                    </>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button type="button" variant="secondary" onClick={onClose}>
                    Cancelar
                  </Button>
                  <Button type="submit">{sprint ? 'Salvar' : 'Criar'}</Button>
                </div>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
