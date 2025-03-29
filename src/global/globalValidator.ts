import { z } from "zod";

export const globalImageValidator = z
  .object({
    uid: z.string().optional(),
    name: z.string().optional(),
    status: z.string().optional(),
    url: z.string().optional(),
    size: z.number().optional(),
  })
  .optional();
