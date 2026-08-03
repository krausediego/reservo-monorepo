import { z } from "zod";
import { professionalSchema } from "./professional.schemas";
import { serviceSchema } from "../service";

export const updateProfessionalServicesSchema = z.object({
  params: z.object({
    id: z.cuid2({ error: "O ID é obrigatório" }),
  }),
  body: z.object({
    services: z
      .array(z.string())
      .min(1, { error: "Você deve selecionar ao menos 1 serviço" }),
  }),
});

export const updateProfessionalServicesResponseSchema = z.object({
  professional: professionalSchema,
  services: z.array(serviceSchema.pick({ id: true, name: true })),
});
