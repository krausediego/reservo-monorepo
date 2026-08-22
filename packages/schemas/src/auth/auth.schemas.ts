import z from "zod";
import { userSchema } from "../user";

export const authResponseSchema = z.object({
  token: z.string(),
  user: userSchema,
});
