import { z } from "zod";
import { paginatedResponse, paginationQuerySchema } from "../helpers";
import { professionalAvailabilitiesSchema, professionalSchema } from ".";
import { serviceSchema } from "../service";

export const listProfessionalsSchema = z.object({
  query: paginationQuerySchema.extend({
    name: z.string().optional(),
    orderBy: z
      .union([z.literal("asc"), z.literal("desc")])
      .default("asc")
      .optional(),
  }),
});

export const listProfessionalsResponseSchema = paginatedResponse(
  z.object({
    professional: professionalSchema,
    availabilities: z.array(professionalAvailabilitiesSchema),
    services: z.array(serviceSchema.pick({ id: true, name: true })),
  }),
);
