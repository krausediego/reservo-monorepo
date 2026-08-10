import z from "zod";

export const authResponseSchema = z.object({
  token: z.string(),
  user: z.object({
    id: z.cuid2(),
    name: z.string(),
    email: z.email(),
    emailVerified: z.boolean(),
    image: z.url(),
    phoneNumber: z.string(),
    phoneNumberVerified: z.boolean(),
    role: z.union([z.literal("CLIENT"), z.literal("ADMIN")]),
    createdAt: z.date(),
    updatedAt: z.date(),
  }),
});
