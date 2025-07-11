import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "@/App";

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

describe("App", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("renderiza o título principal", () => {
    render(<App />);

    expect(screen.getByText("Tasks")).toBeInTheDocument();
  });

  it("renderiza o componente TasksTable", () => {
    render(<App />);

    // Verifica se o botão "Nova Task" está presente (parte do TasksTable)
    expect(screen.getByText("Nova Task")).toBeInTheDocument();
  });

  it("tem a estrutura de layout correta", () => {
    render(<App />);

    const container = screen.getByText("Tasks").closest("div");
    expect(container).toHaveClass("w-full", "max-w-4xl");
  });

  it("exibe mensagem quando não há tasks", () => {
    render(<App />);

    expect(screen.getByText("No results.")).toBeInTheDocument();
  });
});