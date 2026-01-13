import { z } from "zod";
import { transactionsTypes } from "../../shared/constant";

export const transactionCreateValidate = z.object({
  body: z.object({
    title: z.string(),
    type: z.enum(transactionsTypes as [string, ...string[]]),
    amount: z.number(),
    isPending: z.boolean().optional(),
  }),
});

export const transactionUpdateValidate = z.object({
  body: z.object({
    title: z.string().optional(),
    type: z.enum(transactionsTypes as [string, ...string[]]).optional(),
    amount: z.number().optional(),
    isPending: z.boolean().optional(),
  }).strict(),
});
