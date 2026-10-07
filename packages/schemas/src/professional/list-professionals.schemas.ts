import { z } from "zod";
import { paginatedResponse, paginationQuerySchema } from "../helpers";
import {
  professionalAvailabilitiesSchema,
  professionalSchema,
} from "./professional.schemas";
import { serviceSchema } from "../service";
import { userSchema } from "../user";

export const listProfessionalsSchema = z.object({
  query: paginationQuerySchema.extend({
    name: z.string().optional(),
    isActive: z.stringbool().optional(),
    services: z
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

export const listProfessionalsResponseSchema = paginatedResponse(
  z.object({
    professional: professionalSchema.extend({
      user: userSchema.pick({
        email: true,
        phoneNumber: true,
      }),
    }),
    availabilities: z.array(professionalAvailabilitiesSchema),
    services: z.array(serviceSchema.pick({ id: true, name: true })),
  }),
);
