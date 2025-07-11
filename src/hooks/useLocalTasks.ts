import type { Priority } from "@/types/task.types";
import { useEffect, useState } from "react";

const TASKS_KEY = "tasks";

export type Task = {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  createdAt: Date;
  isCompleted: boolean;
};

export function useLocalTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const addTask = (task: Task) => {
    setTasks((prev) => [...prev, task]);
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const toggleTaskStatus = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, isCompleted: !task.isCompleted } : task,
      ),
    );
  };

  useEffect(() => {
    try {
      const stored = localStorage.getItem(TASKS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);

        if (Array.isArray(parsed)) {
          const validTasks = parsed.map((task) => ({
            ...task,
            createdAt: new Date(task.createdAt),
          }));

          setTasks(validTasks);
        }
      }
    } catch (err) {
      console.error("Erro ao carregar tasks do localStorage:", err);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    try {
      localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
    } catch (err) {
      console.error("Erro ao salvar tasks no localStorage:", err);
    }
  }, [tasks, isLoaded]);

  return {
    tasks,
    addTask,
    deleteTask,
    toggleTaskStatus,
  };
}
