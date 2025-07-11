export function translatePriority(priority: "p1" | "p2" | "p3"): string {
  switch (priority) {
    case "p1":
      return "Alta";
    case "p2":
      return "Média";
    case "p3":
      return "Baixa";
    default:
      return "Desconhecida";
  }
}
