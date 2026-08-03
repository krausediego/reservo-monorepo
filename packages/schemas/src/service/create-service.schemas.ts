import { z } from "zod";
import { serviceSchema } from "./service.schemas";

export const createServiceSchema = z.object({
  body: z.object({
    name: z
      .string({ error: "O nome é obrigatório" })
      .min(4, { error: "O nome deve conter ao menos 4 caracteres" })
      .max(256, { error: "O nome deve conter no máximo 256 caracteres" })
      .regex(/^[a-zA-Z0-9À-ÿ\s]*$/, {
        error: "O nome não pode conter caracteres especiais",
      }),

    description: z
      .string({ error: "A descrição é obrigatória" })
      .min(10, { error: "A descrição deve conter ao menos 10 caracteres" })
      .max(1000, { error: "A descrição está muito longa" }),

    durationInMinutes: z
      .number({ error: "A duração é obrigatória" })
      .int({ error: "A duração deve ser um número inteiro" })
      .positive({ error: "A duração deve ser maior que zero" })
      .max(1440, { error: "A duração não pode exceder 24hrs" }),

    priceCents: z
      .number({ error: "O preço é obrigatório" })
      .int({ error: "O preço deve ser um número inteiro" })
      .nonnegative({ error: "O preço não pode ser negativo" })
      .max(10_000_00, "Preço acima do limite permitido"),
  }),
});

export const createServiceResponseSchema = z.object({
  service: serviceSchema,
});
