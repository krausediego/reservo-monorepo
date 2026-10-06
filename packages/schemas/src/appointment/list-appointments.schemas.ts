import { z } from "zod";
import { paginatedResponse, paginationQuerySchema } from "../helpers";
import { APPOINTMENT_STATUS, appointmentSchema } from "./appointment.schemas";

export const listAppointmentsSchema = z.object({
  query: paginationQuerySchema.extend({
    date: z.string(),
    view: z.union([
      z.literal("day"),
      z.literal("week"),
      z.literal("month"),
      z.literal("agenda"),
    ]),
    professionals: z
      .union([z.string(), z.array(z.string())])
      .transform((val) => (Array.isArray(val) ? val : val.split(",")))
      .pipe(z.array(z.string()))
      .optional(),
    status: z
      .union([z.string(), z.array(z.string())])
      .transform((val) => (Array.isArray(val) ? val : val.split(",")))
      .pipe(z.array(z.enum(APPOINTMENT_STATUS)))
      .optional(),
    services: z
      .union([z.string(), z.array(z.string())])
      .transform((val) => (Array.isArray(val) ? val : val.split(",")))
      .pipe(z.array(z.string()))
      .optional(),
  }),
});

export const listAppointmentsResponseSchema =
  paginatedResponse(appointmentSchema);
