import { z } from "zod";
import { establishmentSchema } from ".";

const businessHourSchema = z.object(
  {
    day: z
      .int({ error: "O dia da semana é obrigatório" })
      .min(0, { error: "O dia deve estar entre 0 e 6" })
      .max(6, { error: "O dia deve estar entre 0 e 6" }),

    open: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, {
      error: "Horário de abertura inválido",
    }),

    close: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, {
      error: "Horário de fechamento inválido",
    }),

    closed: z.boolean(),
  },
  { error: "O horário de funcionamento é obrigatório" },
);

const businessHoursArraySchema = z
  .array(businessHourSchema)
  .min(7, { error: "Horário de funcionamento em quantidade inválida" })
  .max(7, { error: "Horário de funcionamento em quantidade inválida" })
  .refine(
    (hours) => {
      const days = hours.map((h) => h.day);
      return new Set(days).size === days.length;
    },
    { error: "Existem dias da semana duplicados" },
  );
// .refine(
//   (hours) => {
//     hours.every((h) => {
//       if (h.closed) return true;
//       return h.open < h.close;
//     });
//   },
//   { error: "O horário de abertura deve ser anterior ao de fechamento" },
// );

const singleFileSchema = (maxSizeMb: number, fieldLabel: string) =>
  z
    .array(
      z.object({
        fieldname: z.string(),
        originalname: z.string(),
        mimetype: z.enum(["image/jpeg", "image/png", "image/webp"], {
          error: `Formato de ${fieldLabel} inválido`,
        }),
        buffer: z.instanceof(Buffer),
        size: z.number().max(maxSizeMb * 1024 * 1024, {
          error: `${fieldLabel} deve ter no máximo ${maxSizeMb}MB`,
        }),
      }),
    )
    .max(1, { error: `Apenas um arquivo de ${fieldLabel} é permitido` })
    .transform((files) => {
      const file = files[0];
      if (!file) return undefined;

      return new File([file.buffer as BlobPart], file.originalname, {
        type: file.mimetype,
      });
    })
    .optional();

export const createEstablishmentSchema = z.object({
  body: z.object({
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

    latitude: z.coerce
      .number({ error: "A latitude é obrigatória" })
      .min(-90, { error: "Latitude inválida" })
      .max(90, { error: "Latitude inválida" }),

    longitude: z.coerce
      .number({ error: "A longitude é obrigatória" })
      .min(-180, { error: "Longitude inválida" })
      .max(180, { error: "Longitude inválida" }),

    businessHours: z
      .string({
        error: "O horário de funcionamento é obrigatório",
      })
      .transform((val, ctx) => {
        try {
          return JSON.parse(val);
        } catch {
          ctx.addIssue({
            code: "custom",
            error: "businessHours deve ser um JSON válido",
          });
          return z.NEVER;
        }
      })
      .pipe(businessHoursArraySchema),

    phone: z
      .string()
      .regex(/^(\+55\s?)?(\(?\d{2}\)?\s?)?\d{4,5}-?\d{4}$/, {
        error: "Telefone inválido",
      })
      .optional(),

    logo: singleFileSchema(5, "logo"),

    cover: singleFileSchema(10, "cover"),
  }),
});

export const createEstablishmentResponseSchema = z.object({
  establishment: establishmentSchema,
});
