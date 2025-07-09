import { IconLayoutKanbanFilled } from "@tabler/icons-react";
import { BentoGrid, BentoGridItem } from "./components/ui/bento-grid";
import { FormSchema, TaskForm } from "./components/task-form";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type z from "zod";
import type { Task } from "./types/task.types";
import { Skeleton } from "./components/ui/skeleton";

function App() {
  const getInitialTasks = (): Task[] => {
    const stored = localStorage.getItem("tasks");
    if (stored) {
      try {
        return JSON.parse(stored, (key, value) => {
          return key === "createdAt" ? new Date(value) : value;
        });
      } catch {
        return [];
      }
    }
    return [];
  };

  const [stateTasks, setStateTasks] = useState<Task[]>(getInitialTasks);

  // Atualiza o localStorage sempre que as tasks mudarem
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(stateTasks));
  }, [stateTasks]);

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const newTask: Task = {
      id: (stateTasks.length + 1).toString(),
      title: data.title,
      priority: "p1",
      createdAt: new Date(),
      isCompleted: false,
    };

    toast("Você adicionou uma nova task", {
      description: (
        <pre className="mt-2 w-[320px] rounded-md bg-neutral-950 p-4">
          <code className="text-white">{JSON.stringify(newTask, null, 2)}</code>
        </pre>
      ),
    });

    setStateTasks((prevTasks) => [...prevTasks, newTask]);
  }

  const items = [
    {
      title: <TaskForm onSubmit={onSubmit} />,
      description: "Crie um novo item.",
      header: <Skeleton />,
      className: "md:col-span-1",
    },
    {
      title: "Kanban",
      description: "Visualização das tasks.",
      header: <Skeleton />,
      className: "md:col-span-2",
      icon: <IconLayoutKanbanFilled className="h-4 w-4 text-neutral-500" />,
    },
    // {
    //   title: "The Art of Design",
    //   description: "Discover the beauty of thoughtful and functional design.",
    //   header: <Skeleton />,
    //   className: "md:col-span-3",
    //   icon: <IconSignature className="h-4 w-4 text-neutral-500" />,
    // },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 gap-4">
      <BentoGrid className="max-w-4xl w-full mx-auto md:auto-rows-[20rem] px-4">
        {items.map((item, i) => (
          <BentoGridItem
            key={i}
            title={item.title}
            description={item.description}
            header={item.header}
            className={item.className}
            icon={item.icon}
          />
        ))}
      </BentoGrid>

      {/* Lista de tasks */}
      <div className="w-full max-w-4xl px-4 mt-8">
        <h2 className="text-xl font-semibold mb-2">Tasks</h2>
        <ul className="space-y-2">
          {stateTasks.map((task) => (
            <li
              key={task.id}
              className="p-4 bg-white rounded shadow flex justify-between"
            >
              <div>
                <p className="font-medium">{task.title}</p>
                <p className="text-sm text-gray-500">
                  Criada em: {task.createdAt.toLocaleString()}
                </p>
              </div>
              <span
                className={`px-2 py-1 rounded text-xs font-medium ${
                  task.isCompleted
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {task.isCompleted ? "Concluída" : "Pendente"}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
