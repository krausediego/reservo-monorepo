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
  phone: z.string().nullable(),
  organizationId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  slug: z.string(),
  isActive: z.boolean(),
  logoUrl: z.string().nullable(),
  coverUrl: z.string().nullable(),
});

export const establishmentAvailabilitiesSchema = z.object({
  id: z.cuid2(),
  establishmentId: z.cuid2(),
  organizationId: z.cuid2(),
  dayOfWeek: z.number().int(),
  startMinutes: z.number(),
  endMinutes: z.number(),
  closed: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
