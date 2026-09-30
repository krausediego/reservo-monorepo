import z, { literal } from "zod";

export const customerSchema = z.object({
  id: z.cuid2(),
  userId: z.cuid2().nullable(),
  organizationId: z.cuid2(),
  name: z.string(),
  phone: z.string().nullable(),
  email: z.string().nullable(),
  notes: z.string().nullable(),
  source: z.union([
    z.literal("ONLINE"),
    z.literal("WALK_IN"),
    z.literal("IMPORTED"),
  ]),
  createdAt: z.date(),
  updatedAt: z.date().nullable(),
});
