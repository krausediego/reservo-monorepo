import { z } from "zod";
import { professionalAvailabilitiesSchema, professionalSchema } from ".";
import { serviceSchema } from "../service";

export const getProfessionalSchema = z.object({
  params: z.object({
    id: z.cuid2({ error: "O id é obrigatório" }),
  }),
});

export const getProfessionalResponseSchema = z.object({
  professional: professionalSchema,
});
