import { z } from "zod";
import { paginatedResponse, paginationQuerySchema } from "../helpers";
import { userSchema } from "../user";
import { memberSchema } from "./member.schemas";

export const listMembersSchema = z.object({
  query: paginationQuerySchema.extend({
    name: z.string().optional(),
    roles: z
      .union([z.string(), z.array(z.string())])
      .optional()
      .transform((val) => {
        if (!val) return undefined;
        if (!Array.isArray(val)) return val.split(",");
      }),
    orderBy: z
      .union([z.literal("asc"), z.literal("desc")])
      .optional()
      .default("asc"),
  }),
});

export const listMembersResponseSchema = paginatedResponse(
  z.object({
    user: userSchema.omit({
      emailVerified: true,
      phoneNumberVerified: true,
    }),
    member: memberSchema,
  }),
);
