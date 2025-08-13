import { z } from "zod";

const baseEventSchema = z.object({
  title: z.string().min(1, "Title is required").max(150),
  description: z.string().max(2000).optional(),
  location: z.string().max(200).optional(),
  category: z
    .enum(["conference", "workshop", "webinar", "meetup", "festival", "concert", "competition", "other"])
    .default("other"),
  startDate: z.coerce.date({ required_error: "Start date is required" }),
  endDate: z.coerce.date().optional(),
  allDay: z.boolean().default(false),
  isOnline: z.boolean().default(false),
  onlineLink: z.string().url().optional(),
  organizer: z.object({
    name: z.string().min(1, "Organizer name is required").max(100),
    email: z.string().email("Invalid organizer email"),
    phone: z.string().optional(),
  }),
  attendees: z.number().optional(),
  tickets: z.number().optional(),
  tags: z.array(z.string().min(1)).default([]),
  isPublic: z.boolean().default(true),
});

export const eventCreateValidate = z.object({
  body: baseEventSchema,
});

export const eventUpdateValidate = z.object({
  body: baseEventSchema.partial(),
});
