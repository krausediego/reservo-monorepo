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
  startMinutes: z.number(),
  endMinutes: z.number(),
  opened: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const professionalRatingStats = z.object({
  id: z.cuid2(),
  professionalId: z.cuid2(),
  reviewCount: z.number(),
  ratingSum: z.number(),
  ratingAvg: z.number(),
  rating1: z.number(),
  rating2: z.number(),
  rating3: z.number(),
  rating4: z.number(),
  rating5: z.number(),
  updatedAt: z.date(),
});
