import { z } from "zod";
import { todosPriorities } from "../../shared/constant";

export const todoCreateValidate = z.object({
  body: z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    isCompleted: z.boolean().optional(),
    dueDate: z.union([z.string().datetime(), z.date()]).optional(),
    priority: z.enum(todosPriorities as [string, ...string[]]).optional(),
  }),
});

export const todoUpdateValidate = z.object({
  body: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    isCompleted: z.boolean().optional(),
    dueDate: z.union([z.string().datetime(), z.date()]).optional(),
    priority: z.enum(todosPriorities as [string, ...string[]]).optional(),
  }),
});
