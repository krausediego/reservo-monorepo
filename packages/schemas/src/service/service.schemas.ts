import z from "zod";

export const serviceSchema = z.object({
  id: z.cuid2(),
  organizationId: z.cuid2(),
  name: z.string(),
  description: z.string(),
  durationMinutes: z.number(),
  priceCents: z.number(),
  isActive: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
