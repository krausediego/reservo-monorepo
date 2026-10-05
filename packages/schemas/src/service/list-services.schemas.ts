import { z } from "zod";
import { paginatedResponse, paginationQuerySchema } from "../helpers";
import { serviceSchema } from ".";

export const listServicesSchema = z.object({
  query: paginationQuerySchema.extend({
    name: z.string().optional(),
    isActive: z.stringbool().optional(),
    professionals: z
      .union([z.string(), z.array(z.string())])
      .transform((val) => (Array.isArray(val) ? val : val.split(",")))
      .pipe(z.array(z.cuid2()))
      .optional(),
    orderBy: z
      .union([z.literal("asc"), z.literal("desc")])
      .optional()
      .default("asc"),
  }),
});

export const listServicesResponseSchema = paginatedResponse(serviceSchema);
