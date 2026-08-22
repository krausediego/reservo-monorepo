import z from "zod";

export const invitationSchema = z.object({
  id: z.cuid2(),
  email: z.email(),
  organizationId: z.cuid2(),
  establishment: z.object({
    id: z.cuid2(),
    name: z.string(),
    logoUrl: z.url().nullable(),
  }),
  inviter: z.object({
    id: z.cuid2(),
    name: z.string(),
    email: z.email(),
  }),
  role: z.union([
    z.literal("OWNER"),
    z.literal("MANAGER"),
    z.literal("PROFESSIONAL"),
  ]),
  status: z.union([
    z.literal("PENDING"),
    z.literal("ACCEPTED"),
    z.literal("REJECTED"),
    z.literal("CANCELLED"),
  ]),
  expiresAt: z.date(),
});
