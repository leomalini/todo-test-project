import { createContext, useContext, type ReactNode } from "react";
import { useLocalTasks } from "@/hooks/useLocalTasks";

type TasksContextType = ReturnType<typeof useLocalTasks>;

const TasksContext = createContext<TasksContextType | undefined>(undefined);

export function TasksProvider({ children }: { children: ReactNode }) {
  const tasksData = useLocalTasks();

  return (
    <TasksContext.Provider value={tasksData}>{children}</TasksContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TasksContext);
  if (context === undefined) {
    throw new Error("useTasks must be used within a TasksProvider");
  }
  return context;
}
