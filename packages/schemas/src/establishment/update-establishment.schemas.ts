import { z } from "zod";
import { createEstablishmentSchema, establishmentSchema } from ".";

export const updateEstablishmentSchema = z.object({
  params: z.object({
    id: z.string({ error: "O ID é obrigatório" }),
  }),
  body: createEstablishmentSchema.shape.body,
});

export const updateEstablishmentResponseSchema = z.object({
  establishment: establishmentSchema,
});
