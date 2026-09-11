import { z } from "zod";
import { userSchema } from "../user";
import { establishmentSchema } from "../establishment";
import { memberSchema } from "../member/member.schemas";

export const meResponseSchema = z.object({
  user: userSchema.extend({
    memberRole: memberSchema.shape.role.optional(),
  }),
  establishment: establishmentSchema.nullable(),
});
