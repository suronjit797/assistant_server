import { z } from "zod";

const dailyTaskSchema = z.object({
  name: z.string(),
  description: z.string(),
  order: z.number(),
});

const bodySchema = z.object({
  user: z.string(),
  title: z.string(),
  description: z.string(),
  isActive: z.boolean(),
  tasks: dailyTaskSchema.array().default([]).optional(),
});

export const dailyPlanTemplateCreateZodSchema = z.object({
  body: bodySchema,
});

export const dailyPlanTemplateUpdateZodSchema = z.object({
  body: bodySchema.partial(),
});
