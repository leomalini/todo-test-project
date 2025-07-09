import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { TaskForm } from "./task-form";

describe("TaskForm", () => {
  it("deve renderizar o campo de título e o botão de submit", () => {
    render(<TaskForm onSubmit={vi.fn()} />);

    expect(screen.getByLabelText(/título/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /salvar/i })).toBeInTheDocument();
  });

  it("deve mostrar erro se o campo for submetido vazio", async () => {
    render(<TaskForm onSubmit={vi.fn()} />);
    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: /salvar/i }));

    expect(
      await screen.findByText(/must be at least 2 characters/i),
    ).toBeInTheDocument();
  });

  it("deve chamar onSubmit com os dados corretos quando o formulário for válido", async () => {
    const handleSubmit = vi.fn();
    render(<TaskForm onSubmit={handleSubmit} />);
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/título/i), "Minha tarefa");
    await user.click(screen.getByRole("button", { name: /salvar/i }));

    expect(handleSubmit).toHaveBeenCalledTimes(1);
    expect(handleSubmit.mock.calls[0][0]).toEqual({ title: "Minha tarefa" });
  });
});
