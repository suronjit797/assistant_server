import { z } from "zod";
import { userRole } from "../../shared/constant";
import { globalImageValidator } from "../../global/globalValidator";

export const userCreateZodSchema = z.object({
  body: z.object({
    name: z.string(),
    email: z.string(),
    role: z.enum(Object.values(userRole) as [string, ...string[]]).optional(),
    password: z.string().min(6),
    phone: z.string(),
    loginId: z.string(),
    isActive: z.boolean().optional(),
    avatar: globalImageValidator,
  }),
});

export const userLoginZodSchema = z.object({
  body: z.object({
    email: z.string(),
    password: z.string(),
  }),
});

export const userUpdateZodSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    email: z.string().optional(),
    phone: z.string().optional(),
    role: z.enum(Object.values(userRole) as [string, ...string[]]).optional(),
    password: z.string().min(6).optional(),
    loginId: z.string().optional(),
    isActive: z.boolean().optional(),
    avatar: globalImageValidator,
  }),
});

export const forgotPasswordZodSchema = z.object({
  body: z.object({
    email: z.string(),
  }),
});
export const resetPasswordZodSchema = z.object({
  body: z.object({
    token: z.string(),
    password: z.string().min(6),
  }),
});
