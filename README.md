# FlowTask - Sistema de Produtividade

Um sistema de produtividade completo e intuitivo que combina **Kanban**, **Pomodoro** e **Scrum** para organizar tarefas e estudos.

## 🚀 Como Rodar Localmente

### Pré-requisitos

- [Node.js](https://nodejs.org/) versão 18 ou superior
- npm (vem com Node.js) ou [Bun](https://bun.sh/)

### Instalação

1. **Clone o repositório**
```bash
git clone <repository-url>
cd flowtask
```

2. **Instale as dependências**
```bash
npm install
# ou
bun install
```

3. **Inicie o servidor de desenvolvimento**
```bash
npm run dev
# ou
bun dev
```

4. **Acesse a aplicação**

Abra seu navegador e acesse: `http://localhost:5173`

### Build para Produção

```bash
npm run build
```

Os arquivos de produção serão gerados na pasta `dist/`.

### Preview da Build

```bash
npm run preview
```

---

## 📖 Como Utilizar o Sistema

### Dashboard

A página inicial mostra uma visão geral da sua produtividade:

- **Total de Tarefas**: Quantidade de tarefas criadas
- **Tarefas Concluídas**: Tarefas finalizadas
- **Pomodoros Hoje**: Ciclos de foco completados no dia
- **Sprint Ativo**: Sprint em andamento (se houver)
- **Tarefas Recentes**: Lista das últimas tarefas criadas

### Kanban Board

Sistema de quadro visual para gerenciar tarefas:

1. **Criar Tarefa**: Clique em "Nova Tarefa" ou no botão "+" em qualquer coluna
2. **Editar Tarefa**: Clique em uma tarefa existente
3. **Mover Tarefa**: Arraste e solte entre as colunas
4. **Excluir Tarefa**: Abra a tarefa e clique em "Excluir"

**Campos da Tarefa:**
- Título (obrigatório)
- Descrição
- Prioridade (Baixa, Média, Alta)
- Status (A Fazer, Em Progresso, Concluído)
- Prazo
- Tags

**Filtros disponíveis:**
- Busca por texto
- Filtro por prioridade
- Filtro por tag

### Pomodoro Timer

Técnica de produtividade com ciclos de foco:

1. **Selecionar Tarefa**: Escolha uma tarefa para focar (opcional)
2. **Iniciar Timer**: Clique em "Iniciar" para começar o ciclo
3. **Pausar/Retomar**: Use os botões de controle
4. **Resetar**: Reinicie o timer atual

**Configurações:**
- Duração do foco (padrão: 25 min)
- Pausa curta (padrão: 5 min)
- Pausa longa (padrão: 15 min)
- Sessões até pausa longa (padrão: 4)
- Sons de notificação

**O tempo focado é automaticamente registrado na tarefa selecionada.**

### Gestão de Sprints

Organize suas tarefas em ciclos de trabalho:

1. **Criar Sprint**: Clique em "Novo Sprint"
2. **Definir Meta**: Estabeleça o objetivo do sprint
3. **Selecionar Tarefas**: Escolha as tarefas do Kanban para incluir
4. **Definir Duração**: 1, 2, 3 ou 4 semanas
5. **Ativar Sprint**: Mude o status para "Ativo"
6. **Acompanhar Progresso**: Visualize o burndown chart
7. **Concluir Sprint**: Ao finalizar, adicione a retrospectiva

**Campos do Sprint:**
- Nome
- Meta
- Data de início
- Duração
- Status (Planejamento, Ativo, Concluído)
- Tarefas selecionadas
- Retrospectiva (ao concluir)

### Modo Claro/Escuro

Clique no ícone de sol/lua no canto superior direito para alternar entre os temas.

---

## 🛠️ Tecnologias Utilizadas

| Tecnologia | Uso |
|------------|-----|
| React 18 | Biblioteca UI |
| TypeScript | Tipagem estática |
| Vite | Build tool |
| Tailwind CSS | Estilização |
| Framer Motion | Animações |
| @hello-pangea/dnd | Drag and drop |
| date-fns | Manipulação de datas |
| shadcn/ui | Componentes UI |
| Recharts | Gráficos |
| localStorage | Persistência de dados |

---

## 📁 Estrutura do Projeto

```
src/
├── components/       # Componentes reutilizáveis
│   ├── ui/          # Componentes shadcn/ui
│   ├── Layout.tsx
│   ├── KanbanColumn.tsx
│   ├── TaskCard.tsx
│   ├── TaskModal.tsx
│   ├── PomodoroTimer.tsx
│   ├── PomodoroSettings.tsx
│   ├── SprintCard.tsx
│   ├── SprintModal.tsx
│   ├── BurndownChart.tsx
│   └── StatsCard.tsx
├── context/         # Context API para estado global
│   └── TaskContext.tsx
├── hooks/           # Custom hooks
│   └── usePomodoro.ts
├── lib/             # Utilitários
│   ├── storage.ts   # Funções de localStorage
│   └── utils.ts
├── pages/           # Páginas da aplicação
│   ├── Dashboard.tsx
│   ├── Kanban.tsx
│   ├── Pomodoro.tsx
│   └── Sprints.tsx
├── types/           # Tipos TypeScript
│   └── index.ts
└── App.tsx          # Componente raiz
```

---

## 💾 Armazenamento de Dados

Todos os dados são salvos automaticamente no **localStorage** do navegador:

- Tarefas
- Configurações do Pomodoro
- Histórico de sessões Pomodoro
- Sprints
- Preferência de tema

**Os dados persistem entre sessões**, mas são específicos do navegador/dispositivo.

---

## ✨ Funcionalidades

### Kanban Board
- ✅ Colunas: A Fazer, Em Progresso, Concluído
- ✅ Drag-and-drop funcional
- ✅ Criar, editar e excluir tarefas
- ✅ Prioridades (Baixa, Média, Alta)
- ✅ Tags personalizadas
- ✅ Prazos com calendário
- ✅ Filtros e busca

### Pomodoro Timer
- ✅ Timer configurável
- ✅ Pausas curtas e longas automáticas
- ✅ Integração com tarefas
- ✅ Registro de tempo focado
- ✅ Histórico de sessões
- ✅ Sons de notificação

### Gestão de Sprints
- ✅ Criar sprints com metas
- ✅ Selecionar tarefas do Kanban
- ✅ Burndown chart visual
- ✅ Retrospectiva ao concluir
- ✅ Status: Planejamento, Ativo, Concluído

### Geral
- ✅ Dashboard com métricas
- ✅ Modo claro/escuro
- ✅ Design responsivo
- ✅ Dados persistentes

---

## 📄 Licença

MIT License - Sinta-se livre para usar e modificar!

---

Feito com ❤️ usando [Lovable](https://lovable.dev)
