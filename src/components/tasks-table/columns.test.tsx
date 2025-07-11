import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TasksProvider } from "@/contexts/TasksContext";
import { DataTable } from "@/components/tasks-table/data-table";
import { columns } from "@/components/tasks-table/columns";
import type { Task } from "@/types/task.types";

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

const renderWithContext = (tasks: Task[]) => {
  localStorage.setItem("tasks", JSON.stringify(tasks));

  return render(
    <TasksProvider>
      <DataTable columns={columns} data={tasks} />
    </TasksProvider>,
  );
};

describe("TasksTable Columns", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("permite deletar uma task", async () => {
    const mockTasks: Task[] = [
      {
        id: "1",
        title: "Task para deletar",
        priority: "p1",
        createdAt: new Date(),
        isCompleted: false,
      },
    ];

    renderWithContext(mockTasks);

    // Clica no menu de ações
    const actionButton = screen.getByRole("button", { name: /open menu/i });
    await userEvent.click(actionButton);

    // Clica em deletar
    await userEvent.click(screen.getByText("Deletar"));

    await waitFor(() => {
      expect(screen.getByText("No results.")).toBeInTheDocument();
    });
  });

  it("permite concluir uma task pendente", async () => {
    const mockTasks: Task[] = [
      {
        id: "1",
        title: "Task para concluir",
        priority: "p1",
        createdAt: new Date(),
        isCompleted: false,
      },
    ];

    renderWithContext(mockTasks);

    // Verifica se está pendente
    expect(screen.getByText("Pendente")).toBeInTheDocument();

    // Clica no menu de ações
    const actionButton = screen.getByRole("button", { name: /open menu/i });
    await userEvent.click(actionButton);

    // Clica em concluir
    await userEvent.click(screen.getByText("Concluir"));

    await waitFor(() => {
      expect(screen.getByText("Concluído")).toBeInTheDocument();
    });
  });

  it("permite reabrir uma task concluída", async () => {
    const mockTasks: Task[] = [
      {
        id: "1",
        title: "Task para reabrir",
        priority: "p1",
        createdAt: new Date(),
        isCompleted: true,
      },
    ];

    renderWithContext(mockTasks);

    // Verifica se está concluída
    expect(screen.getByText("Concluído")).toBeInTheDocument();

    // Clica no menu de ações
    const actionButton = screen.getByRole("button", { name: /open menu/i });
    await userEvent.click(actionButton);

    // Clica em reabrir
    await userEvent.click(screen.getByText("Reabrir"));

    await waitFor(() => {
      expect(screen.getByText("Pendente")).toBeInTheDocument();
    });
  });

  it("exibe diferentes opções de menu baseado no status da task", async () => {
    const pendingTask: Task = {
      id: "1",
      title: "Task Pendente",
      priority: "p1",
      createdAt: new Date(),
      isCompleted: false,
    };

    const completedTask: Task = {
      id: "2",
      title: "Task Concluída",
      priority: "p1",
      createdAt: new Date(),
      isCompleted: true,
    };

    // Testa task pendente
    const { rerender } = renderWithContext([pendingTask]);

    let actionButton = screen.getByRole("button", { name: /open menu/i });
    await userEvent.click(actionButton);

    expect(screen.getByText("Concluir")).toBeInTheDocument();
    expect(screen.queryByText("Reabrir")).not.toBeInTheDocument();

    // Fecha o menu
    await userEvent.keyboard("{Escape}");

    // Testa task concluída
    rerender(
      <TasksProvider>
        <DataTable columns={columns} data={[completedTask]} />
      </TasksProvider>
    );

    actionButton = screen.getByRole("button", { name: /open menu/i });
    await userEvent.click(actionButton);

    expect(screen.getByText("Reabrir")).toBeInTheDocument();
    expect(screen.queryByText("Concluir")).not.toBeInTheDocument();
  });
});