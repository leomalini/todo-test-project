"use client";

import type { Task } from "@/types/task.types";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "../ui/badge";
import { MoreHorizontal, Trash2, Reply, SquareCheckBig } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTasks } from "@/contexts/TasksContext";

export const columns: ColumnDef<Task>[] = [
  {
    accessorKey: "title",
    header: "Título",
  },
  {
    accessorKey: "description",
    header: "Descrição",
  },
  {
    accessorKey: "priority",
    header: "Prioridade",
    cell: ({ row }) => {
      const priority = row.getValue("priority");
      switch (priority) {
        case "p1":
          return <Badge variant="high">Alta</Badge>;
        case "p2":
          return <Badge variant="medium">Média</Badge>;
        case "p3":
          return <Badge variant="low">Baixa</Badge>;
        default:
          return "Indefinida";
      }
    },
  },
  {
    accessorKey: "createdAt",
    header: "Criado em",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return date.toLocaleDateString("pt-BR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    },
  },
  {
    accessorKey: "isCompleted",
    header: "Status",
    cell: ({ row }) => {
      const isCompleted = row.getValue("isCompleted");
      return (
        <Badge variant={isCompleted ? "completed" : "pending"}>
          {isCompleted ? "Concluído" : "Pendente"}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const task = row.original;
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const { deleteTask, toggleTaskStatus } = useTasks();
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Ações</DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() => deleteTask(task.id)}
              className="text-destructive hover:bg-destructive/10 focus:bg-destructive/10 hover:text-destructive focus:text-destructive"
            >
              Deletar
              <Trash2 className="ml-auto h-4 w-4 text-destructive hover:bg-destructive/10 focus:bg-destructive/10" />
            </DropdownMenuItem>
            <DropdownMenuSeparator />

            {task.isCompleted ? (
              <DropdownMenuItem
                onClick={() => toggleTaskStatus(task.id)}
                className="text-orange-500 hover:bg-orange-500/10 focus:bg-orange-500/10 hover:text-orange-500 focus:text-orange-500"
              >
                Reabrir
                <Reply className="ml-auto h-4 w-4 text-orange-500 hover:bg-orange-500/10 focus:bg-orange-500/10" />
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem
                onClick={() => toggleTaskStatus(task.id)}
                className="text-emerald-600 hover:bg-emerald-600/10 focus:bg-emerald-600/10 hover:text-emerald-600 focus:text-emerald-600"
              >
                Concluir
                <SquareCheckBig className="ml-auto h-4 w-4 text-emerald-600 hover:bg-emerald-600/10 focus:bg-emerald-600/10" />
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
