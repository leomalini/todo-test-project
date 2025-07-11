import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useLocalTasks } from "@/hooks/useLocalTasks";

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

describe("useLocalTasks", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("inicializa com array vazio quando não há dados no localStorage", () => {
    const { result } = renderHook(() => useLocalTasks());

    expect(result.current.tasks).toEqual([]);
  });

  it("carrega tasks do localStorage na inicialização", () => {
    const mockTasks = [
      {
        id: "1",
        title: "Task 1",
        description: "Descrição 1",
        priority: "p1" as const,
        createdAt: new Date("2024-01-01"),
        isCompleted: false,
      },
    ];

    localStorage.setItem("tasks", JSON.stringify(mockTasks));

    const { result } = renderHook(() => useLocalTasks());

    expect(result.current.tasks).toHaveLength(1);
    expect(result.current.tasks[0].title).toBe("Task 1");
    expect(result.current.tasks[0].createdAt).toBeInstanceOf(Date);
  });

  it("adiciona uma nova task", () => {
    const { result } = renderHook(() => useLocalTasks());

    const newTask = {
      id: "1",
      title: "Nova Task",
      description: "Descrição da nova task",
      priority: "p2" as const,
      createdAt: new Date(),
      isCompleted: false,
    };

    act(() => {
      result.current.addTask(newTask);
    });

    expect(result.current.tasks).toHaveLength(1);
    expect(result.current.tasks[0]).toEqual(newTask);
  });

  it("deleta uma task", () => {
    const { result } = renderHook(() => useLocalTasks());

    const task1 = {
      id: "1",
      title: "Task 1",
      priority: "p1" as const,
      createdAt: new Date(),
      isCompleted: false,
    };

    const task2 = {
      id: "2",
      title: "Task 2",
      priority: "p2" as const,
      createdAt: new Date(),
      isCompleted: false,
    };

    act(() => {
      result.current.addTask(task1);
      result.current.addTask(task2);
    });

    expect(result.current.tasks).toHaveLength(2);

    act(() => {
      result.current.deleteTask("1");
    });

    expect(result.current.tasks).toHaveLength(1);
    expect(result.current.tasks[0].id).toBe("2");
  });

  it("alterna o status de uma task", () => {
    const { result } = renderHook(() => useLocalTasks());

    const task = {
      id: "1",
      title: "Task 1",
      priority: "p1" as const,
      createdAt: new Date(),
      isCompleted: false,
    };

    act(() => {
      result.current.addTask(task);
    });

    expect(result.current.tasks[0].isCompleted).toBe(false);

    act(() => {
      result.current.toggleTaskStatus("1");
    });

    expect(result.current.tasks[0].isCompleted).toBe(true);

    act(() => {
      result.current.toggleTaskStatus("1");
    });

    expect(result.current.tasks[0].isCompleted).toBe(false);
  });

  it("persiste tasks no localStorage", () => {
    const { result } = renderHook(() => useLocalTasks());

    const newTask = {
      id: "1",
      title: "Task Persistida",
      priority: "p1" as const,
      createdAt: new Date(),
      isCompleted: false,
    };

    act(() => {
      result.current.addTask(newTask);
    });

    const storedTasks = JSON.parse(localStorage.getItem("tasks") || "[]");
    expect(storedTasks).toHaveLength(1);
    expect(storedTasks[0].title).toBe("Task Persistida");
  });

  it("lida com dados corrompidos no localStorage", () => {
    localStorage.setItem("tasks", "dados-inválidos");

    const { result } = renderHook(() => useLocalTasks());

    expect(result.current.tasks).toEqual([]);
  });

  it("lida com dados não-array no localStorage", () => {
    localStorage.setItem("tasks", JSON.stringify({ not: "an array" }));

    const { result } = renderHook(() => useLocalTasks());

    expect(result.current.tasks).toEqual([]);
  });
});