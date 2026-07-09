import z from "zod";

export const serviceSchema = z.object({
  id: z.cuid2(),
  establishmentId: z.cuid2(),
  name: z.string(),
  description: z.string(),
  durationMinutes: z.string(),
  price: z.number(),
  isActive: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
