"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { PRIORITIES } from "@/types/task.types";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CheckCircle } from "lucide-react";

export const FormSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().optional(),
  priority: z.enum(PRIORITIES),
});

interface TaskFormProps {
  onSubmit: (data: TaskFormValues) => void;
}

export type TaskFormValues = z.infer<typeof FormSchema>;

export function TaskForm({ onSubmit }: TaskFormProps) {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      priority: "p1",
      description: "",
    },
  });

  const handleFormSubmit = (data: TaskFormValues) => {
    onSubmit(data);
    setSubmitted(true);

    setTimeout(() => {
      setSubmitted(false);
      setOpen(false);
      form.reset();
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="hover:cursor-pointer">Nova Task</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        {submitted ? (
          <div className="flex flex-col items-center justify-center py-10">
            <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
            <p className="text-xl font-semibold text-center">
              Tarefa criada com sucesso!
            </p>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Crie uma nova tarefa</DialogTitle>
              <DialogDescription>
                Preencha os campos abaixo para criar uma nova tarefa.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleFormSubmit)}
                className="w-full max-w-sm space-y-6"
              >
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título</FormLabel>
                      <FormControl>
                        <Input placeholder="Informe o título" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição</FormLabel>
                      <FormControl>
                        <Input placeholder="Informe a descrição" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prioridade</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a prioridade" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Prioridades</SelectLabel>
                              {PRIORITIES.map((priority) => (
                                <SelectItem key={priority} value={priority}>
                                  {priority.toUpperCase()}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline" type="button">
                      Cancelar
                    </Button>
                  </DialogClose>
                  <Button type="submit">Salvar</Button>
                </DialogFooter>
              </form>
            </Form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
