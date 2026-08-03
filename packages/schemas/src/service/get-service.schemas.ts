import { z } from "zod";
import { serviceSchema } from "./service.schemas";

export const getServiceSchema = z.object({
  params: z.object({
    id: z.cuid2({ error: "O ID é obrigatório" }),
  }),
});

export const getServiceResponseSchema = z.object({
  service: serviceSchema,
});
