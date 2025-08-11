import { z } from "zod";

const baseSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email address").max(100),
  phone: z.string().optional(),
  others: z.array(z.string().min(1)).optional(),
  company: z.string().max(100).optional(),
  jobTitle: z.string().max(100).optional(),
  notes: z.string().max(500).optional(),
  tags: z.array(z.string().min(1)).default([]),
});

export const contactCreateValidate = z.object({
  body: baseSchema,
});

export const contactUpdateValidate = z.object({
  body: baseSchema.partial(),
});
