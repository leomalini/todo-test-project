import type { Task } from "@/types/task.types";
import { useState } from "react";
import { toast } from "sonner";
import type z from "zod";
import { FormSchema, TaskForm } from "./task-form";

export default function TaskList() {
  const tasks: Task[] = [
    {
      id: "1",
      title: "Task 1",
      priority: "p1",
      createdAt: new Date(),
      isCompleted: false,
    },
    {
      id: "2",
      title: "Task 2",
      priority: "p2",
      createdAt: new Date(),
      isCompleted: true,
    },
    {
      id: "3",
      title: "Task 3",
      priority: "p3",
      createdAt: new Date(),
      isCompleted: false,
    },
  ];

  const [stateTasks, setStateTasks] = useState<Task[]>(tasks);

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast("You submitted the following values", {
      description: (
        <pre className="mt-2 w-[320px] rounded-md bg-neutral-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });

    setStateTasks((prevTasks) => [
      ...prevTasks,
      {
        id: (prevTasks.length + 1).toString(),
        title: data.title,
        priority: "p1",
        createdAt: new Date(),
        isCompleted: false,
      },
    ]);
  }
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 gap-4">
      <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">
        Tasks
      </h1>
      <TaskForm onSubmit={onSubmit} />
      <ul className="w-full max-w-md bg-white shadow-md rounded-lg p-4">
        {stateTasks.map((task) => (
          <li key={task.id} className="p-4 border-b-2 last:border-0">
            {task.title}
          </li>
        ))}
      </ul>
    </div>
  );
}
