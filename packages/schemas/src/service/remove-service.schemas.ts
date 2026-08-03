import { z } from "zod";
import { serviceSchema } from "./service.schemas";

export const removeServiceSchema = z.object({
  params: z.object({
    id: z.cuid2({ error: "O ID é obrigatório" }),
  }),
});

export const removeServiceResponseSchema = z.object({
  service: serviceSchema,
});
