import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TasksTable from "@/components/tasks-table/tasks-table";
import { TasksProvider } from "@/contexts/TasksContext";
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

const renderWithContext = (initialTasks: Task[] = []) => {
  if (initialTasks.length > 0) {
    localStorage.setItem("tasks", JSON.stringify(initialTasks));
  }

  return render(
    <TasksProvider>
      <TasksTable />
    </TasksProvider>,
  );
};

describe("TasksTable", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("exibe mensagem quando não há tasks", () => {
    renderWithContext();

    expect(screen.getByText("No results.")).toBeInTheDocument();
  });

  it("exibe tasks na tabela", async () => {
    const mockTasks: Task[] = [
      {
        id: "1",
        title: "Task 1",
        description: "Descrição 1",
        priority: "p1",
        createdAt: new Date("2024-01-01"),
        isCompleted: false,
      },
      {
        id: "2",
        title: "Task 2",
        priority: "p2",
        createdAt: new Date("2024-01-02"),
        isCompleted: true,
      },
    ];

    renderWithContext(mockTasks);

    await waitFor(() => {
      expect(screen.getByText("Task 1")).toBeInTheDocument();
      expect(screen.getByText("Task 2")).toBeInTheDocument();
    });
  });

  it("exibe badges de prioridade corretas", async () => {
    const mockTasks: Task[] = [
      {
        id: "1",
        title: "Task Alta",
        priority: "p1",
        createdAt: new Date(),
        isCompleted: false,
      },
      {
        id: "2",
        title: "Task Média",
        priority: "p2",
        createdAt: new Date(),
        isCompleted: false,
      },
      {
        id: "3",
        title: "Task Baixa",
        priority: "p3",
        createdAt: new Date(),
        isCompleted: false,
      },
    ];

    renderWithContext(mockTasks);

    await waitFor(() => {
      expect(screen.getByText("Alta")).toBeInTheDocument();
      expect(screen.getByText("Média")).toBeInTheDocument();
      expect(screen.getByText("Baixa")).toBeInTheDocument();
    });
  });

  it("exibe status correto das tasks", async () => {
    const mockTasks: Task[] = [
      {
        id: "1",
        title: "Task Pendente",
        priority: "p1",
        createdAt: new Date(),
        isCompleted: false,
      },
      {
        id: "2",
        title: "Task Concluída",
        priority: "p2",
        createdAt: new Date(),
        isCompleted: true,
      },
    ];

    renderWithContext(mockTasks);

    await waitFor(() => {
      expect(screen.getByText("Pendente")).toBeInTheDocument();
      expect(screen.getByText("Concluído")).toBeInTheDocument();
    });
  });

  it("permite filtrar tasks por título", async () => {
    const mockTasks: Task[] = [
      {
        id: "1",
        title: "Estudar React",
        priority: "p1",
        createdAt: new Date(),
        isCompleted: false,
      },
      {
        id: "2",
        title: "Fazer compras",
        priority: "p2",
        createdAt: new Date(),
        isCompleted: false,
      },
    ];

    renderWithContext(mockTasks);

    await waitFor(() => {
      expect(screen.getByText("Estudar React")).toBeInTheDocument();
      expect(screen.getByText("Fazer compras")).toBeInTheDocument();
    });

    const filterInput = screen.getByPlaceholderText("Filtre suas tasks...");
    await userEvent.type(filterInput, "React");

    await waitFor(() => {
      expect(screen.getByText("Estudar React")).toBeInTheDocument();
      expect(screen.queryByText("Fazer compras")).not.toBeInTheDocument();
    });
  });

  it("permite limpar filtros", async () => {
    const mockTasks: Task[] = [
      {
        id: "1",
        title: "Task 1",
        priority: "p1",
        createdAt: new Date(),
        isCompleted: false,
      },
      {
        id: "2",
        title: "Task 2",
        priority: "p2",
        createdAt: new Date(),
        isCompleted: false,
      },
    ];

    renderWithContext(mockTasks);

    const filterInput = screen.getByPlaceholderText("Filtre suas tasks...");
    await userEvent.type(filterInput, "Task 1");

    await waitFor(() => {
      expect(screen.getByText("Reset")).toBeInTheDocument();
    });

    await userEvent.click(screen.getByText("Reset"));

    await waitFor(() => {
      expect(screen.getByText("Task 1")).toBeInTheDocument();
      expect(screen.getByText("Task 2")).toBeInTheDocument();
    });
  });

  it("formata datas corretamente", async () => {
    const mockDate = new Date("2024-01-15T10:30:00Z");
    const mockTasks: Task[] = [
      {
        id: "1",
        title: "Task com Data",
        priority: "p1",
        createdAt: mockDate,
        isCompleted: false,
      },
    ];

    renderWithContext(mockTasks);

    await waitFor(() => {
      // A data deve estar formatada em pt-BR
      expect(screen.getByText(/15\/01\/2024/)).toBeInTheDocument();
    });
  });
});