import { useState } from 'react';
import { Plus, Target, Archive } from 'lucide-react';
import { useTaskContext } from '@/context/TaskContext';
import { SprintCard } from '@/components/SprintCard';
import { SprintModal } from '@/components/SprintModal';
import { BurndownChart } from '@/components/BurndownChart';
import { Sprint } from '@/types';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Sprints() {
  const { sprints, getActiveSprint } = useTaskContext();
  const [selectedSprint, setSelectedSprint] = useState<Sprint | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const activeSprint = getActiveSprint();
  const planningSprints = sprints.filter((s) => s.status === 'planning');
  const completedSprints = sprints.filter((s) => s.status === 'completed');

  const openNewSprintModal = () => {
    setSelectedSprint(null);
    setIsModalOpen(true);
  };

  const openEditSprintModal = (sprint: Sprint) => {
    setSelectedSprint(sprint);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSprint(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestão de Sprints</h1>
          <p className="text-muted-foreground">Organize suas tarefas em ciclos de trabalho</p>
        </div>
        <Button onClick={openNewSprintModal}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Sprint
        </Button>
      </div>

      {activeSprint && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Sprint Ativo
          </h2>
          <div className="grid gap-6 lg:grid-cols-2">
            <SprintCard sprint={activeSprint} onClick={() => openEditSprintModal(activeSprint)} />
            <BurndownChart sprint={activeSprint} />
          </div>
        </div>
      )}

      <Tabs defaultValue="planning" className="w-full">
        <TabsList>
          <TabsTrigger value="planning" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Planejamento ({planningSprints.length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex items-center gap-2">
            <Archive className="h-4 w-4" />
            Concluídos ({completedSprints.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="planning" className="mt-6">
          {planningSprints.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border bg-card/50 p-12 text-center">
              <Target className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                Nenhum sprint em planejamento
              </h3>
              <p className="text-muted-foreground mb-4">
                Crie um novo sprint para começar a organizar suas tarefas em ciclos
              </p>
              <Button onClick={openNewSprintModal}>
                <Plus className="mr-2 h-4 w-4" />
                Criar Sprint
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {planningSprints.map((sprint) => (
                <SprintCard
                  key={sprint.id}
                  sprint={sprint}
                  onClick={() => openEditSprintModal(sprint)}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="mt-6">
          {completedSprints.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border bg-card/50 p-12 text-center">
              <Archive className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                Nenhum sprint concluído
              </h3>
              <p className="text-muted-foreground">
                Sprints concluídos aparecerão aqui com suas retrospectivas
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {completedSprints.map((sprint) => (
                <SprintCard
                  key={sprint.id}
                  sprint={sprint}
                  onClick={() => openEditSprintModal(sprint)}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <SprintModal isOpen={isModalOpen} onClose={closeModal} sprint={selectedSprint} />
    </div>
  );
}
