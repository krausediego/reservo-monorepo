import { z } from "zod";
import { paginatedResponse, paginationQuerySchema } from "../helpers";
import { userSchema } from "../user";
import { memberSchema } from "./member.schemas";

const ROLES = ["OWNER", "MANAGER", "PROFESSIONAL"] as const;

export const listMembersSchema = z.object({
  query: paginationQuerySchema.extend({
    name: z.string().optional(),
    roles: z
      .union([z.string(), z.array(z.string())])
      .transform((val) => (Array.isArray(val) ? val : val.split(",")))
      .pipe(z.array(z.enum(ROLES)).min(1))
      .optional(),
    availableLinkProfessional: z.stringbool().optional(),
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
