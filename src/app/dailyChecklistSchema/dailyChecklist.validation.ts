import { z } from "zod";
import { dailyTaskSchema } from "../dailyPlanTemplate/dailyPlanTemplate.validation";

const bodySchema = z.object({
  user: z.string(),
  template: z.string(),
  date: z.string(),
  tasks: dailyTaskSchema
    .and(z.object({ isCompleted: z.boolean(), completedAt: z.string() }))
    .array()
    .default([])
    .optional(),
});

export const dailyChecklistCreateZodSchema = z.object({
  body: bodySchema,
});

export const dailyChecklistUpdateZodSchema = z.object({
  body: bodySchema.partial(),
});
