import { z } from "zod";
import { paginatedResponse, paginationQuerySchema } from "../helpers";
import { serviceSchema } from ".";

export const listServicesSchema = z.object({
  query: paginationQuerySchema.extend({
    name: z.string().optional(),
    orderBy: z
      .union([z.literal("asc"), z.literal("desc")])
      .optional()
      .default("asc"),
  }),
});

export const listServicesResponseSchema = paginatedResponse(serviceSchema);
