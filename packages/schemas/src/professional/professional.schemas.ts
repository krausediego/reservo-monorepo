import z from "zod";

export const professionalSchema = z.object({
  id: z.cuid2(),
  organizationId: z.cuid2(),
  memberId: z.cuid2(),
  name: z.string(),
  bio: z.string(),
  isActive: z.boolean(),
  avatarUrl: z.url().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const professionalAvailabilitiesSchema = z.object({
  id: z.cuid2(),
  professionalId: z.cuid2(),
  organizationId: z.cuid2(),
  dayOfWeek: z.number().int(),
  startTime: z.string(),
  endTime: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
