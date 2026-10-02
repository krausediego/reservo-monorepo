import { z } from "zod";
import { isoWithTimezone, phoneSchema } from "../helpers";

const existingCustomerSchema = z.object({
  type: z.literal("existing"),
  customerId: z.cuid2({ error: "O cliente é obrigatório" }),
});

const newCustomerSchema = z.object({
  type: z.literal("new"),
  name: z
    .string({ error: "O nome é obrigatório" })
    .min(2, { error: "O nome deve conter ao menos 2 caracteres" })
    .max(120, { error: "O nome deve conter no máximo 120 caracteres" }),
  phone: z.string(),
  email: z.string().optional(),
});

export const createManualAppointmentSchema = z.object({
  body: z.object({
    professionalId: z.cuid2({ error: "O profissional é obrigatório" }),
    serviceId: z.cuid2({ error: "O serviço é obrigatório" }),
    startsAt: isoWithTimezone,
    customer: z.discriminatedUnion("type", [
      existingCustomerSchema,
      newCustomerSchema,
    ]),
    notes: z.string().optional(),
    internalNotes: z.string().optional(),
  }),
});

export const createManualAppointmentResponseSchema = z.object({
  message: z.string(),
});
