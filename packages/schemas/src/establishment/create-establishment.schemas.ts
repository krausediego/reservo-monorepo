import { z } from "zod";

export const createEstablishmentSchema = z.object({
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
      .max(1800, { error: "A descrição está muito longa" }),

    address: z
      .string({ error: "O endereço é obrigatório" })
      .min(5, { error: "O endereço deve conter ao menos 5 caracteres" })
      .max(255, { error: "O endereço deve conter no máximo 255 caracteres" }),

    city: z
      .string({ error: "A cidade é obrigatória" })
      .min(2, { error: "A cidade deve conter ao menos 2 caracteres" })
      .max(100, { error: "A cidade deve conter no máximo 100 caracteres" }),

    state: z
      .string({ error: "O estado é obrigatório" })
      .length(2, { error: "O estado deve ser informado com a sigla (UF)" })
      .regex(/^[A-Z]{2}$/, {
        error: "A UF deve conter duas letras maiúsculas",
      }),

    zipCode: z
      .string({ error: "O CEP é obrigatório" })
      .regex(/^\d{5}-?\d{3}$/, {
        error: "CEP inválido",
      }),

    latitude: z
      .number({ error: "A latitude é obrigatória" })
      .min(-90, { error: "Latitude inválida" })
      .max(90, { error: "Latitude inválida" }),

    longitude: z
      .number({ error: "A longitude é obrigatória" })
      .min(-180, { error: "Longitude inválida" })
      .max(180, { error: "Longitude inválida" }),

    businessHours: z.json(),

    phone: z
      .string()
      .regex(/^(\+55\s?)?(\(?\d{2}\)?\s?)?\d{4,5}-?\d{4}$/, {
        error: "Telefone inválido",
      })
      .optional(),

    avatar: z
      .file()
      .mime(["image/jpeg", "image/png", "image/webp"])
      .max(5 * 1024 * 1024, {
        error: "O avatar deve ter no máximo 5MB",
      }),

    coverUrl: z
      .file()
      .mime(["image/jpeg", "image/png", "image/webp"])
      .max(10 * 1024 * 1024, {
        error: "A capa deve ter no máximo 10MB",
      }),
  }),
});

export const createEstablishmentResponseSchema = z.object({});
