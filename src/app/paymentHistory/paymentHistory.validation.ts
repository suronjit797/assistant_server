import { z } from "zod";
import { globalImageValidator } from "../../global/globalValidator";

export const paymentCreateZodSchema = z.object({
  body: z.object({
    name: z.string(),
    email: z.string(),
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

export const paymentLoginZodSchema = z.object({
  body: z.object({
    email: z.string(),
    password: z.string(),
  }),
});

export const paymentUpdateZodSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    email: z.string().optional(),
    phone: z.string().optional(),
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
export const resetPasswordZodSchema = z.object({
  body: z.object({
    token: z.string(),
    password: z.string(),
  }),
});
