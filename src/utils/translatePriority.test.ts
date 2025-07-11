import { describe, it, expect } from "vitest";
import { translatePriority } from "@/utils/translatePriority";

describe("translatePriority", () => {
  it("traduz p1 para Alta", () => {
    expect(translatePriority("p1")).toBe("Alta");
  });

  it("traduz p2 para Média", () => {
    expect(translatePriority("p2")).toBe("Média");
  });

  it("traduz p3 para Baixa", () => {
    expect(translatePriority("p3")).toBe("Baixa");
  });

  it("retorna Desconhecida para valores inválidos", () => {
    // @ts-expect-error - testando valor inválido
    expect(translatePriority("invalid")).toBe("Desconhecida");
  });
});