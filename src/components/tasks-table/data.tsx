import type { Task } from "@/types/task.types";

export const tasks: Task[] = [
  {
    id: "1",
    title: "Finalizar relatório mensal",
    description: "Compilar dados e enviar para o financeiro",
    priority: "p1",
    createdAt: new Date("2025-07-01T09:00:00Z"),
    isCompleted: false,
  },
  {
    id: "2",
    title: "Revisar código do PR #42",
    priority: "p2",
    createdAt: new Date("2025-07-05T14:30:00Z"),
    isCompleted: true,
  },
  {
    id: "3",
    title: "Preparar apresentação da sprint",
    description: "Apresentar para o time e stakeholders",
    priority: "p1",
    createdAt: new Date("2025-07-07T10:15:00Z"),
    isCompleted: false,
  },
  {
    id: "4",
    title: "Responder e-mails pendentes",
    priority: "p3",
    createdAt: new Date("2025-07-08T16:00:00Z"),
    isCompleted: true,
  },
  {
    id: "5",
    title: "Atualizar documentação do projeto",
    description: "Adicionar novas rotas da API e fluxos",
    priority: "p2",
    createdAt: new Date("2025-07-03T08:45:00Z"),
    isCompleted: false,
  },
];
