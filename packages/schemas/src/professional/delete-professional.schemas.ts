import { z } from "zod";

export const deleteProfessionalSchema = z.object({
  params: z.object({
    id: z.cuid2({error: "O ID é obrigatório."})
  }),
});

export const deleteProfessionalResponseSchema = z.object({
  deleted: z.boolean(),
});
