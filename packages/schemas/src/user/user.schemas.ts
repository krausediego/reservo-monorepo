import z from "zod";

export const userSchema = z.object({
  id: z.cuid2(),
  name: z.string(),
  email: z.email(),
  emailVerified: z.boolean(),
  role: z.union([z.literal("ADMIN"), z.literal("CLIENT")]),
  image: z.string().nullable(),
  phoneNumber: z.string().nullable(),
  phoneNumberVerified: z.boolean().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
