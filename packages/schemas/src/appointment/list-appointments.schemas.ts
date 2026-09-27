import { z } from "zod";
import {
  isoWithTimezone,
  paginatedResponse,
  paginationQuerySchema,
} from "../helpers";
import { APPOINTMENT_STATUS, appointmentSchema } from "./appointment.schemas";

export const listAppointmentsSchema = z.object({
  query: paginationQuerySchema.extend({
    startsAt: isoWithTimezone,
    endsAt: isoWithTimezone,
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
