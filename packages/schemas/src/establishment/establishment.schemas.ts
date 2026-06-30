import z from "zod";

export const establishmentSchema = z.object({
  name: z.string(),
  id: z.string(),
  cnpj: z.string(),
  description: z.string(),
  address: z.string(),
  city: z.string(),
  state: z.string(),
  zipCode: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  businessHours: z.object(),
  phone: z.string().nullable(),
  organizationId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  slug: z.string(),
  isActive: z.boolean(),
  logoUrl: z.string().nullable(),
  coverUrl: z.string().nullable(),
});
