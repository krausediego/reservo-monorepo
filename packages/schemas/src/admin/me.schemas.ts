import { z } from "zod";
import { userSchema } from "../user";
import { establishmentSchema } from "../establishment";

export const meResponseSchema = z.object({
  user: userSchema,
  establishment: establishmentSchema.nullable(),
});
