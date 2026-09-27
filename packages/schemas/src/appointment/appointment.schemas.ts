import z from "zod";

export const APPOINTMENT_STATUS = [
  "PENDING",
  "CONFIRMED",
  "CANCELLED",
  "COMPLETED",
  "NO_SHOW",
] as const;

export const APPOINTMENT_ORIGIN = ["DASH", "ONLINE"] as const;

export const appointmentSchema = z.object({
  id: z.string(),
  professionalId: z.string(),
  serviceId: z.string(),
  customerId: z.string(),
  startsAt: z.date(),
  endsAt: z.date(),
  status: z.enum(APPOINTMENT_STATUS),
  origin: z.enum(APPOINTMENT_ORIGIN),
  priceCents: z.number(),
  durationMin: z.number(),
  notes: z.string().nullable(),
  internalNotes: z.string().nullable(),
});
