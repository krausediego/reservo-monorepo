import { z } from "zod";
import { paginatedResponse, paginationQuerySchema } from "../helpers";
import { customerSchema } from "./customer.schemas";

export const listCustomersSchema = z.object({
  query: paginationQuerySchema.extend({
    name: z.string().optional(),
    orderBy: z
      .union([z.literal("asc"), z.literal("desc")])
      .optional()
      .default("asc"),
  }),
});

export const listCustomersResponseSchema = paginatedResponse(customerSchema);
