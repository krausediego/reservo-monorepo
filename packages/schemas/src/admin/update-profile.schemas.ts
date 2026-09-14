import { z } from "zod";
import { userSchema } from "../user";

export const updateProfileSchema = z.object({
  body: z.object({
    name: z.string({ error: "O nome é obrigatório" }),
    image: z.instanceof(File).optional(),
    phoneNumber: z.string().nullable(),
  }),
});

export const updateProfileResponseSchema = z.object({
  user: userSchema,
});
