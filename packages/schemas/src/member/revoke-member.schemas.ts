import { z } from "zod";

export const revokeMemberSchema = z.object({
  params: z.object({
    id: z.cuid2({ error: "O ID é obrigatório" }),
  }),
});

export const revokeMemberResponseSchema = z.object({
  message: z.string(),
});
