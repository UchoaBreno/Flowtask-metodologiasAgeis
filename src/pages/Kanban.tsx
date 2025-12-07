import { useState, useMemo } from 'react';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { Plus, Filter, X } from 'lucide-react';
import { useTaskContext } from '@/context/TaskContext';
import { KanbanColumn } from '@/components/KanbanColumn';
import { TaskModal } from '@/components/TaskModal';
import { Task, TaskStatus, Priority } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export default function Kanban() {
  const { tasks, dispatch, getColumns } = useTaskContext();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [defaultStatus, setDefaultStatus] = useState<TaskStatus>('todo');
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'all'>('all');
  const [tagFilter, setTagFilter] = useState('');

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    tasks.forEach((t) => t.tags.forEach((tag) => tags.add(tag)));
    return Array.from(tags);
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch =
        searchQuery === '' ||
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
      const matchesTag = tagFilter === '' || task.tags.includes(tagFilter);
      return matchesSearch && matchesPriority && matchesTag;
    });
  }, [tasks, searchQuery, priorityFilter, tagFilter]);

  const columns = useMemo(() => {
    return [
      { id: 'todo' as TaskStatus, title: 'A Fazer', tasks: filteredTasks.filter((t) => t.status === 'todo') },
      { id: 'in-progress' as TaskStatus, title: 'Em Progresso', tasks: filteredTasks.filter((t) => t.status === 'in-progress') },
      { id: 'done' as TaskStatus, title: 'Concluído', tasks: filteredTasks.filter((t) => t.status === 'done') },
    ];
  }, [filteredTasks]);

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const newStatus = destination.droppableId as TaskStatus;
    dispatch({ type: 'MOVE_TASK', payload: { taskId: draggableId, newStatus } });
  };

  const openNewTaskModal = (status: TaskStatus) => {
    setSelectedTask(null);
    setDefaultStatus(status);
    setIsModalOpen(true);
  };

  const openEditTaskModal = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  const hasFilters = searchQuery || priorityFilter !== 'all' || tagFilter;

  const clearFilters = () => {
    setSearchQuery('');
    setPriorityFilter('all');
    setTagFilter('');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Kanban Board</h1>
          <p className="text-muted-foreground">Organize suas tarefas de forma visual</p>
        </div>
        <Button onClick={() => openNewTaskModal('todo')}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Tarefa
        </Button>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <Input
          placeholder="Buscar tarefas..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full sm:w-64"
        />

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="secondary" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filtros
              {hasFilters && (
                <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                  {[searchQuery, priorityFilter !== 'all', tagFilter].filter(Boolean).length}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-72" align="start">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground">Prioridade</label>
                <Select value={priorityFilter} onValueChange={(v) => setPriorityFilter(v as Priority | 'all')}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="high">Alta</SelectItem>
                    <SelectItem value="medium">Média</SelectItem>
                    <SelectItem value="low">Baixa</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground">Tag</label>
                <Select value={tagFilter} onValueChange={setTagFilter}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Selecionar tag" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todas</SelectItem>
                    {allTags.map((tag) => (
                      <SelectItem key={tag} value={tag}>
                        {tag}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {hasFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters} className="w-full">
                  <X className="mr-2 h-4 w-4" />
                  Limpar filtros
                </Button>
              )}
            </div>
          </PopoverContent>
        </Popover>

        {hasFilters && (
          <p className="text-sm text-muted-foreground">
            {filteredTasks.length} de {tasks.length} tarefas
          </p>
        )}
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid gap-6 lg:grid-cols-3">
          {columns.map((column) => (
            <KanbanColumn
              key={column.id}
              id={column.id}
              title={column.title}
              tasks={column.tasks}
              onTaskClick={openEditTaskModal}
              onAddTask={() => openNewTaskModal(column.id)}
            />
          ))}
        </div>
      </DragDropContext>

      <TaskModal
        isOpen={isModalOpen}
        onClose={closeModal}
        task={selectedTask}
        defaultStatus={defaultStatus}
      />
    </div>
  );
}
