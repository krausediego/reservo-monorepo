import z from "zod";

export const memberSchema = z.object({
  id: z.cuid2(),
  role: z.union([
    z.literal("OWNER"),
    z.literal("MANAGER"),
    z.literal("PROFESSIONAL"),
  ]),
  createdAt: z.date(),
  updatedAt: z.date(),
});
