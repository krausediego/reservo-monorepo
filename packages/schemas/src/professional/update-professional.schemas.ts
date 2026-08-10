import { z } from "zod";
import { professionalSchema } from "./professional.schemas";

const singleFileSchema = (maxSizeMb: number, fieldLabel: string) =>
  z
    .object({
      mimetype: z.enum(["image/jpeg", "image/png", "image/webp"], {
        error: `Formato de ${fieldLabel} inválido`,
      }),
      size: z.number().max(maxSizeMb * 1024 * 1024, {
        error: `${fieldLabel} deve ter no máximo ${maxSizeMb}MB`,
      }),
    })
    .optional();

export const updateProfessionalSchema = z.object({
  params: z.object({
    id: z.cuid2({ error: "O ID é obrigatório" }),
  }),
  body: z.object({
    name: z
      .string({ error: "O nome é obrigatório" })
      .min(4, { error: "O nome deve conter ao menos 4 caracteres" })
      .max(256, { error: "O nome deve conter no máximo 256 caracteres" })
      .regex(/^[a-zA-Z0-9À-ÿ\s]*$/, {
        error: "O nome não pode conter caracteres especiais",
      }),

    bio: z
      .string({ error: "A bio é obrigatória" })
      .min(10, { error: "A bio deve conter ao menos 10 caracteres" })
      .max(1800, { error: "A bio está muito longa" }),

    avatar: singleFileSchema(5, "avatar"),
  }),
});

export const updateProfessionalResponseSchema = z.object({
  professional: professionalSchema,
});
