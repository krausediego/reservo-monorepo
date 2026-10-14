import { z } from "zod";
import { serviceSchema } from "./service.schemas";
import { capitalize } from "../helpers/capitalize";

export const createServiceSchema = z.object({
  body: z.object({
    name: z
      .string({ error: "O nome é obrigatório" })
      .min(4, { error: "O nome deve conter ao menos 4 caracteres" })
      .max(256, { error: "O nome deve conter no máximo 256 caracteres" })
      .transform(capitalize),

    categoryId: z.cuid2({ error: "A categoria é obrigatória" }),

    description: z
      .string({ error: "A descrição é obrigatória" })
      .min(10, { error: "A descrição deve conter ao menos 10 caracteres" })
      .max(400, { error: "A descrição está muito longa" }),

    professionals: z
      .array(z.cuid2({ error: "O profissional é obrigatório" }))
      .min(1, {
        error: "Deve haver ao menos 1 profissional habilitado para o serviço",
      }),

    durationMinutes: z
      .number({ error: "A duração é obrigatória" })
      .int({ error: "A duração deve ser um número inteiro" })
      .positive({ error: "A duração é obrigatória" })
      .max(1440, { error: "A duração não pode exceder 24hrs" }),

    priceCents: z
      .number({ error: "O preço é obrigatório" })
      .int({ error: "O preço deve ser um número inteiro" })
      .positive({ error: "O preço é obrigatório" })
      .max(10_000_00, "Preço acima do limite permitido"),

    isActive: z
      .boolean({ error: "O status do serviço está inválido" })
      .optional(),
  }),
});

export const createServiceResponseSchema = z.object({
  service: serviceSchema,
});
