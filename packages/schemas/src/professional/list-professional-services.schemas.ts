import { z } from "zod";
import { serviceSchema } from "../service";

export const listProfessionalServicesSchema = z.object({
  params: z.object({
    id: z.cuid2({ error: "O ID é obrigatório" }),
  }),
});

export const listProfessionalServicesResponseSchema = z.object({
  services: z.array(serviceSchema.pick({ id: true, name: true })),
});
