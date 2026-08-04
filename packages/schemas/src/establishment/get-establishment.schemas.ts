import { z } from "zod";
import { establishmentAvailabilitiesSchema, establishmentSchema } from ".";

export const getEstablishmentResponseSchema = z.object({
  establishment: establishmentSchema,
  availabilities: z.array(establishmentAvailabilitiesSchema),
});
