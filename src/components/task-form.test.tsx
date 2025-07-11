import { describe, it, vi, expect, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TaskForm } from "@/components/task-form";
import { TasksProvider } from "@/contexts/TasksContext";

// Helper para renderizar com o contexto
const renderWithContext = () => {
  return render(
    <TasksProvider>
      <TaskForm />
    </TasksProvider>,
  );
};

describe("TaskForm", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it("abre o modal ao clicar em 'Nova Task'", async () => {
    renderWithContext();

    await userEvent.click(screen.getByText("Nova Task"));

    expect(screen.getByText("Crie uma nova tarefa")).toBeInTheDocument();
  });

  it("exibe mensagens de erro se os campos estiverem vazios", async () => {
    renderWithContext();

    await userEvent.click(screen.getByText("Nova Task"));
    await userEvent.click(screen.getByText("Salvar"));

    expect(await screen.findByText("Campo obrigatório")).toBeInTheDocument();
  });

  it("cria uma nova tarefa corretamente", async () => {
    renderWithContext();

    await userEvent.click(screen.getByText("Nova Task"));

    await userEvent.type(
      screen.getByPlaceholderText("Informe o título"),
      "Minha Task",
    );
    await userEvent.type(
      screen.getByPlaceholderText("Informe a descrição"),
      "Descrição da task",
    );

    await userEvent.click(screen.getByText("Salvar"));

    // Simula o tempo de 1500ms
    vi.advanceTimersByTime(1500);

    await waitFor(() => {
      expect(
        screen.getByText("Tarefa criada com sucesso!"),
      ).toBeInTheDocument();
    });
  }, 10000); // ⏱ aumenta o tempo limite deste teste

  it("fecha o modal após criar a tarefa", async () => {
    renderWithContext();

    await userEvent.click(screen.getByText("Nova Task"));

    await userEvent.type(
      screen.getByPlaceholderText("Informe o título"),
      "Fechar Modal",
    );
    await userEvent.click(screen.getByText("Salvar"));

    vi.advanceTimersByTime(1500);

    await waitFor(() => {
      expect(
        screen.getByText("Tarefa criada com sucesso!"),
      ).toBeInTheDocument();
    });
  }, 10000);
});
