import { z } from "zod";
import { establishmentSchema } from "./establishment.schemas";

const timeMinutesSchema = z
  .number()
  .int("Deve ser minutos inteiros")
  .min(0, "Fora do range do dia")
  .max(1439, "Fora do range do dia") // 23:59 = 1439
  .refine((m) => m % 15 === 0, "Deve ser múltiplo de 15 minutos");

const businessHourSchema = z.object(
  {
    dayOfWeek: z
      .int({ error: "O dia da semana é obrigatório" })
      .min(0, { error: "O dia deve estar entre 0 e 6" })
      .max(6, { error: "O dia deve estar entre 0 e 6" }),
    startMinutes: timeMinutesSchema,
    endMinutes: timeMinutesSchema,
    opened: z.boolean(),
  },
  { error: "O horário de funcionamento é obrigatório" },
);

const businessHoursArraySchema = z
  .array(businessHourSchema)
  .min(7, { error: "Horário de funcionamento em quantidade inválida" })
  .max(7, { error: "Horário de funcionamento em quantidade inválida" })
  .refine(
    (hours) => {
      const days = hours.map((h) => h.dayOfWeek);
      return new Set(days).size === days.length;
    },
    { error: "Existem dias da semana duplicados" },
  )
  .refine(
    (hours) => {
      return hours.every((h) => {
        if (!h.opened) return true;

        return h.startMinutes < h.endMinutes;
      });
    },
    { error: "O horário de abertura deve ser anterior ao de fechamento" },
  );

export const establishmentBodySchema = z.object({
  name: z
    .string({ error: "O nome é obrigatório" })
    .min(4, { error: "O nome deve conter ao menos 4 caracteres" })
    .max(256, { error: "O nome deve conter no máximo 256 caracteres" })
    .regex(/^[a-zA-Z0-9À-ÿ\s]*$/, {
      error: "O nome não pode conter caracteres especiais",
    }),
  cnpj: z
    .string({ error: "O CNPJ é obrigatório" })
    .min(14, "CNPJ deve ter pelo menos 14 caracteres")
    .max(18, "CNPJ deve ter no máximo 18 caracteres"),
  description: z
    .string({ error: "A descrição é obrigatória" })
    .min(10, { error: "A descrição deve conter ao menos 10 caracteres" })
    .max(1800, { error: "A descrição está muito longa" }),
  street: z
    .string({ error: "A rua é obrigatória" })
    .min(5, { error: "A rua deve conter ao menos 5 caracteres" })
    .max(255, { error: "A rua deve conter no máximo 255 caracteres" }),
  number: z
    .number({ error: "O número é obrigatório" })
    .int({ error: "O número deve ser inteiro" })
    .positive({ error: "O número não pode ser negativo" }),
  neighborhood: z
    .string({ error: "O bairro é obrigatório" })
    .min(2, { error: "O bairro deve ter ao menos 2 caracteres" })
    .max(100, { error: "O bairro deve ter no máximo 100 caracteres" }),
  city: z
    .string({ error: "A cidade é obrigatória" })
    .min(2, { error: "A cidade deve conter ao menos 2 caracteres" })
    .max(100, { error: "A cidade deve conter no máximo 100 caracteres" }),
  state: z
    .string({ error: "O estado é obrigatório" })
    .min(4, { error: "O estado deve conter ao menos 4 caracteres" })
    .max(100, { error: "O estado deve conter no máximo 100 caracteres" }),
  zipCode: z
    .string({ error: "O CEP é obrigatório" })
    .min(10, { error: "O CEP está inválido" }),
  latitude: z
    .number({ error: "A latitude é obrigatória" })
    .min(-90, { error: "Latitude inválida" })
    .max(90, { error: "Latitude inválida" }),
  longitude: z
    .number({ error: "A longitude é obrigatória" })
    .min(-180, { error: "Longitude inválida" })
    .max(180, { error: "Longitude inválida" }),
  establishmentAvailabilities: businessHoursArraySchema,
  phone: z.string().optional(),
  logo: z.instanceof(File).optional(),
  cover: z.instanceof(File).optional(),
});

export const createEstablishmentSchema = z.object({
  body: establishmentBodySchema,
});

const jsonField = <T extends z.ZodTypeAny>(schema: T, label: string) =>
  z
    .string({ error: `${label} é obrigatório` })
    .transform((val, ctx) => {
      try {
        return JSON.parse(val) as unknown;
      } catch {
        ctx.addIssue({
          code: "custom",
          error: `${label} deve ser um JSON válido`,
        });
        return z.NEVER;
      }
    })
    .pipe(schema);

export const establishmentMultipartSchema = establishmentBodySchema.extend({
  number: z.coerce
    .number<number>({ error: "O número é obrigatório" })
    .int({ error: "O número deve ser inteiro" })
    .positive({ error: "O número não pode ser negativo" }),
  latitude: z.coerce
    .number<number>({ error: "A latitude é obrigatória" })
    .min(-90, { error: "Latitude inválida" })
    .max(90, { error: "Latitude inválida" }),
  longitude: z.coerce
    .number<number>({ error: "A longitude é obrigatória" })
    .min(-180, { error: "Longitude inválida" })
    .max(180, { error: "Longitude inválida" }),
  establishmentAvailabilities: jsonField(
    businessHoursArraySchema,
    "O horário de funcionamento",
  ),
});

export type EstablishmentBody = z.output<typeof establishmentBodySchema>;

export const createEstablishmentMultipartSchema = z.object({
  body: establishmentMultipartSchema,
});

export const createEstablishmentResponseSchema = z.object({
  establishment: establishmentSchema,
});
