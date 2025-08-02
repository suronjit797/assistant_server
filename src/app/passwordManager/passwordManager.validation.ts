import { z } from "zod";
import { passwordManagerTypes } from "../../shared/constant";

const baseSchema = z.object({
  website: z.string(),
  username: z.string(),
  encryptedPassword: z.string(),
  notes: z.string(),
  category: z.enum(passwordManagerTypes as [string, ...string[]]),
});

export const pmCreateValidate = z.object({
  body: baseSchema,
});

export const pmUpdateValidate = z.object({
  body: baseSchema.partial(),
});
