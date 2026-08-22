import { z } from "zod";

export const rejectInvitationSchema = z.object({
  params: z.object({
    id: z.cuid2({ error: "O ID é obrigatório" }),
  }),
});

export const rejectInvitationResponseSchema = z.object({
  message: z.string(),
});
