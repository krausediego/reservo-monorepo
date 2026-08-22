import { z } from "zod";
import { invitationSchema } from "./invitation.schemas";

export const sendInviteSchema = z.object({
  body: z.object({
    email: z.email({ error: "Digite um e-mail válido." }),
    role: z.union([
      z.literal("OWNER"),
      z.literal("MANAGER"),
      z.literal("PROFESSIONAL"),
    ]),
  }),
});

export const sendInviteResponseSchema = invitationSchema.omit({
  establishment: true,
  inviter: true,
});
