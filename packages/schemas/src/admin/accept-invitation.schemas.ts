import { z } from "zod";

export const acceptInvitationSchema = z.object({
  params: z.object({
    id: z.cuid2({ error: "O ID é obrigatório." }),
  }),
});

export const acceptInvitationResponseSchema = z.object({
  message: z.string(),
});
