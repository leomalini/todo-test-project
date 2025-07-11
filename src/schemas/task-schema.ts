import { PRIORITIES } from "@/types/task.types";
import z from "zod";

export const FormSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().optional(),
  priority: z.enum(PRIORITIES),
});

export type TaskFormValues = z.infer<typeof FormSchema>;
