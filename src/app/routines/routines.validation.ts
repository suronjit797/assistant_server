import { z } from "zod";
import { dayConstants } from "../../shared/constant";

export const routineCreateValidate = z.object({
  body: z.object({
    day: z.enum(dayConstants as [string, ...string[]]),
    time: z.string(),
    title: z.string(),
    description: z.string(),
    duration: z.number(),
  }),
});

export const routineUpdateValidate = z.object({
  body: z.object({
    day: z.enum(dayConstants as [string, ...string[]]).optional(),
    time: z.string().optional(),
    title: z.string().optional(),
    description: z.string().optional(),
    duration: z.number().optional(),
  }),
});
