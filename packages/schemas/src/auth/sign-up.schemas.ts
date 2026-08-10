import z from "zod";
import { authResponseSchema } from "./auth.schemas";

export const signUpSchema = z.object({
  body: z
    .object({
      name: z
        .string({ error: "O nome é obrigatório" })
        .min(4, { error: "O nome deve conter ao menos 4 caracteres" }),
      email: z.email({ error: "Digite um e-mail válido" }),
      password: z
        .string({ error: "A senha é obrigatória" })
        .min(8, { error: "A senha deve conter ao menos 8 caracteres." }),
      role: z.union([z.literal("CLIENT"), z.literal("ADMIN")]),
      repeatPassword: z.string({
        error: "A confirmação de senha é obrigatória",
      }),
    })
    .refine((data) => data.password === data.repeatPassword, {
      message: "As senhas não conferem",
      path: ["repeatPassword"],
    }),
});

export const signUpResponseSchema = authResponseSchema;
