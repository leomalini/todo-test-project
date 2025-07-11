import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { TasksProvider, useTasks } from "@/contexts/TasksContext";
import { ReactNode } from "react";

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

// Componente de teste para usar o contexto
function TestComponent() {
  const { tasks, addTask, deleteTask, toggleTaskStatus } = useTasks();

  return (
    <div>
      <div data-testid="tasks-count">{tasks.length}</div>
      <button
        onClick={() =>
          addTask({
            id: "1",
            title: "Test Task",
            priority: "p1",
            createdAt: new Date(),
            isCompleted: false,
          })
        }
      >
        Add Task
      </button>
      <button onClick={() => deleteTask("1")}>Delete Task</button>
      <button onClick={() => toggleTaskStatus("1")}>Toggle Status</button>
      {tasks.map((task) => (
        <div key={task.id} data-testid={`task-${task.id}`}>
          {task.title} - {task.isCompleted ? "Completed" : "Pending"}
        </div>
      ))}
    </div>
  );
}

// Componente para testar erro quando usado fora do provider
function TestComponentWithoutProvider() {
  try {
    useTasks();
    return <div>Should not render</div>;
  } catch (error) {
    return <div data-testid="error">{(error as Error).message}</div>;
  }
}

describe("TasksContext", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("fornece funcionalidades de tasks através do contexto", () => {
    render(
      <TasksProvider>
        <TestComponent />
      </TasksProvider>
    );

    expect(screen.getByTestId("tasks-count")).toHaveTextContent("0");
    expect(screen.getByText("Add Task")).toBeInTheDocument();
    expect(screen.getByText("Delete Task")).toBeInTheDocument();
    expect(screen.getByText("Toggle Status")).toBeInTheDocument();
  });

  it("lança erro quando useTasks é usado fora do provider", () => {
    render(<TestComponentWithoutProvider />);

    expect(screen.getByTestId("error")).toHaveTextContent(
      "useTasks must be used within a TasksProvider"
    );
  });

  it("permite adicionar tasks através do contexto", () => {
    render(
      <TasksProvider>
        <TestComponent />
      </TasksProvider>
    );

    const addButton = screen.getByText("Add Task");
    addButton.click();

    expect(screen.getByTestId("tasks-count")).toHaveTextContent("1");
    expect(screen.getByTestId("task-1")).toHaveTextContent("Test Task - Pending");
  });

  it("permite deletar tasks através do contexto", () => {
    render(
      <TasksProvider>
        <TestComponent />
      </TasksProvider>
    );

    // Adiciona uma task
    const addButton = screen.getByText("Add Task");
    addButton.click();

    expect(screen.getByTestId("tasks-count")).toHaveTextContent("1");

    // Deleta a task
    const deleteButton = screen.getByText("Delete Task");
    deleteButton.click();

    expect(screen.getByTestId("tasks-count")).toHaveTextContent("0");
  });

  it("permite alternar status das tasks através do contexto", () => {
    render(
      <TasksProvider>
        <TestComponent />
      </TasksProvider>
    );

    // Adiciona uma task
    const addButton = screen.getByText("Add Task");
    addButton.click();

    expect(screen.getByTestId("task-1")).toHaveTextContent("Test Task - Pending");

    // Alterna o status
    const toggleButton = screen.getByText("Toggle Status");
    toggleButton.click();

    expect(screen.getByTestId("task-1")).toHaveTextContent("Test Task - Completed");
  });
});