export const PRIORITIES = ["p1", "p2", "p3"] as const;

export type Priority = (typeof PRIORITIES)[number];

export type Task = {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  createdAt: Date;
  isCompleted: boolean;
};
