import { z } from "zod";
import { establishmentSchema } from ".";

export const getEstablishmentResponseSchema = z.object({
  establishment: establishmentSchema,
});
