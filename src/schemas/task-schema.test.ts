import { describe, it, expect } from "vitest";
import { FormSchema } from "@/schemas/task-schema";

describe("TaskSchema", () => {
  it("valida um objeto task válido", () => {
    const validTask = {
      title: "Título válido",
      description: "Descrição opcional",
      priority: "p1" as const,
    };

    const result = FormSchema.safeParse(validTask);
    expect(result.success).toBe(true);
  });

  it("valida task sem descrição", () => {
    const taskWithoutDescription = {
      title: "Título válido",
      priority: "p2" as const,
    };

    const result = FormSchema.safeParse(taskWithoutDescription);
    expect(result.success).toBe(true);
  });

  it("rejeita título muito curto", () => {
    const invalidTask = {
      title: "A",
      priority: "p1" as const,
    };

    const result = FormSchema.safeParse(invalidTask);
    expect(result.success).toBe(false);
    
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Title must be at least 2 characters.");
    }
  });

  it("rejeita título vazio", () => {
    const invalidTask = {
      title: "",
      priority: "p1" as const,
    };

    const result = FormSchema.safeParse(invalidTask);
    expect(result.success).toBe(false);
  });

  it("rejeita prioridade inválida", () => {
    const invalidTask = {
      title: "Título válido",
      priority: "invalid" as any,
    };

    const result = FormSchema.safeParse(invalidTask);
    expect(result.success).toBe(false);
  });

  it("rejeita objeto sem título", () => {
    const invalidTask = {
      priority: "p1" as const,
    };

    const result = FormSchema.safeParse(invalidTask);
    expect(result.success).toBe(false);
  });

  it("rejeita objeto sem prioridade", () => {
    const invalidTask = {
      title: "Título válido",
    };

    const result = FormSchema.safeParse(invalidTask);
    expect(result.success).toBe(false);
  });

  it("aceita todas as prioridades válidas", () => {
    const priorities = ["p1", "p2", "p3"] as const;

    priorities.forEach(priority => {
      const task = {
        title: "Título válido",
        priority,
      };

      const result = FormSchema.safeParse(task);
      expect(result.success).toBe(true);
    });
  });
});