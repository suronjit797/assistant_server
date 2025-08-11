import { z } from "zod";


const moodEnum = z.enum([
  "happy",
  "sad",
  "angry",
  "excited",
  "neutral",
  "anxious",
] as const);


const attachmentSchema = z.object({
  name: z.string().min(1),
  url: z.string().url(),
  size: z.number().int().nonnegative(),
  type: z.string().min(1),
});

const versionSchema = z.object({
  content: z.string(),
  updatedAt: z.coerce.date(),
});


const baseSchema = z.object({
  userId: z.string().optional(),
  title: z.string().min(1),
  date: z.coerce.date(),
  content: z.string().min(1),
  mood: moodEnum.optional(),
  tags: z.array(z.string().min(1)).optional(),
  attachments: z.array(attachmentSchema).optional(),
  isPublic: z.boolean().optional(),
  shareableLink: z.string().optional(),
  versionHistory: z.array(versionSchema).optional(),
});


export const diaryCreateValidate = z.object({
  body: baseSchema,
});


export const diaryUpdateValidate = z.object({
  body: baseSchema.partial(),
});

