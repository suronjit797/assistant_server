import { z } from "zod";

const blogStatusEnum = ["draft", "published", "archived", "scheduled"] as const;

const commentSchema = z.object({
  user: z.string().min(1, "User ID is required"),
  text: z.string().min(1, "Comment text is required"),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

const seoSchema = z.object({
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  keywords: z.array(z.string()).optional(),
});

const baseSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  content: z.string().min(1, "Content is required"),
  excerpt: z.string().optional(),
  author: z.string().min(1, "Author ID is required"),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  coverImage: z.string().optional(),
  status: z.enum(blogStatusEnum).default("draft"),
  scheduledAt: z.union([z.string(), z.date()]).optional(),
  views: z.number().optional(),
  likes: z.number().optional(),
  comments: z.array(commentSchema).optional(),
  seo: seoSchema.optional(),
});

export const blogCreateValidate = z.object({
  body: baseSchema,
});

export const blogUpdateValidate = z.object({
  body: baseSchema.partial(),
});
