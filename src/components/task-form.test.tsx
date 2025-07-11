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
    // Limpa localStorage antes de cada teste
    localStorage.clear();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    localStorage.clear();
  });

  it("abre o modal ao clicar em 'Nova Task'", async () => {
    renderWithContext();

    await userEvent.click(screen.getByText("Nova Task"));

    expect(screen.getByText("Crie uma nova tarefa")).toBeInTheDocument();
  });

  it("exibe mensagens de erro se os campos obrigatórios estiverem vazios", async () => {
    renderWithContext();

    await userEvent.click(screen.getByText("Nova Task"));
    await userEvent.click(screen.getByText("Salvar"));

    expect(await screen.findByText("Title must be at least 2 characters.")).toBeInTheDocument();
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
  });

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
      expect(screen.queryByText("Crie uma nova tarefa")).not.toBeInTheDocument();
    });
  });

  it("permite selecionar diferentes prioridades", async () => {
    renderWithContext();

    await userEvent.click(screen.getByText("Nova Task"));

    // Clica no select de prioridade
    await userEvent.click(screen.getByText("Selecione a prioridade"));
    
    // Verifica se as opções estão disponíveis
    expect(screen.getByText("Alta")).toBeInTheDocument();
    expect(screen.getByText("Média")).toBeInTheDocument();
    expect(screen.getByText("Baixa")).toBeInTheDocument();

    // Seleciona "Alta"
    await userEvent.click(screen.getByText("Alta"));

    // Preenche os outros campos
    await userEvent.type(
      screen.getByPlaceholderText("Informe o título"),
      "Task Prioritária",
    );

    await userEvent.click(screen.getByText("Salvar"));

    vi.advanceTimersByTime(1500);

    await waitFor(() => {
      expect(
        screen.getByText("Tarefa criada com sucesso!"),
      ).toBeInTheDocument();
    });
  });

  it("permite cancelar a criação da tarefa", async () => {
    renderWithContext();

    await userEvent.click(screen.getByText("Nova Task"));

    await userEvent.type(
      screen.getByPlaceholderText("Informe o título"),
      "Task Cancelada",
    );

    await userEvent.click(screen.getByText("Cancelar"));

    expect(screen.queryByText("Crie uma nova tarefa")).not.toBeInTheDocument();
  });

  it("reseta o formulário após criar uma tarefa", async () => {
    renderWithContext();

    // Primeira tarefa
    await userEvent.click(screen.getByText("Nova Task"));
    await userEvent.type(
      screen.getByPlaceholderText("Informe o título"),
      "Primeira Task",
    );
    await userEvent.click(screen.getByText("Salvar"));
    
    vi.advanceTimersByTime(1500);

    await waitFor(() => {
      expect(screen.queryByText("Crie uma nova tarefa")).not.toBeInTheDocument();
    });

    // Segunda tarefa - verifica se o formulário está limpo
    await userEvent.click(screen.getByText("Nova Task"));
    
    const titleInput = screen.getByPlaceholderText("Informe o título");
    const descriptionInput = screen.getByPlaceholderText("Informe a descrição");
    
    expect(titleInput).toHaveValue("");
    expect(descriptionInput).toHaveValue("");
  });
});