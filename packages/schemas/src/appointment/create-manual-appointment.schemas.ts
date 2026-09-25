import { z } from "zod";
import { isoWithTimezone, phoneSchema } from "../helpers";

const existingCustomerSchema = z.object({
  customerId: z.cuid2({ error: "O cliente é obrigatório" }),
});

const newCustomerSchema = z.object({
  name: z
    .string({ error: "O nome é obrigatório" })
    .min(2, { error: "O nome deve conter ao menos 2 caracteres" })
    .max(120, { error: "O nome deve conter no máximo 120 caracteres" }),
  phone: phoneSchema.optional(),
  email: z.email({ error: "Informe um e-mail válido" }).optional(),
});

export const createManualAppointmentSchema = z.object({
  body: z.object({
    professionalId: z.cuid2({ error: "O profissional é obrigatório" }),
    serviceId: z.cuid2({ error: "O serviço é obrigatório" }),
    startsAt: isoWithTimezone,
    customer: z.union([existingCustomerSchema, newCustomerSchema]),
    notes: z.string().optional(),
    internalNotes: z.string().optional(),
  }),
});

export const createManualAppointmentResponseSchema = z.object({
  message: z.string(),
});
