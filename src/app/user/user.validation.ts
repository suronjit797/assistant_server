import { z } from "zod";
import { userRole } from "../../shared/constant";
import { globalImageValidator } from "../../global/globalValidator";

export const userCreateZodSchema = z.object({
  body: z.object({
    name: z.string(),
    email: z.string(),
    role: z.enum(Object.values(userRole) as [string, ...string[]]).optional(),
    password: z.string(),
    phone: z.string(),
    loginId: z.string(),
    isActive: z.boolean(),
    avatar: globalImageValidator,
    lastLogin: z.date(),
    otp: z.number(),
    otpExpiredAt: z.date(),
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
    password: z.string().optional(),
    loginId: z.string().optional(),
    isActive: z.string().optional(),
    avatar: globalImageValidator,
    lastLogin: z.string().optional(),
    otp: z.string().optional(),
    otpExpiredAt: z.string().optional(),
  }),
});

export const forgotPasswordZodSchema = z.object({
  body: z.object({
    email: z.string(),
  }),
});
