import { z } from "zod";
import {
  professionalAvailabilitiesSchema,
  professionalSchema,
} from "./professional.schemas";
import { serviceSchema } from "../service";
import { fromJson } from "../helpers";
import { userSchema } from "../user";

export const servicesIdsSchema = z
  .array(z.cuid2({ error: "Formato inválido" }), {
    error: "Serviços em formato inválido",
  })
  .min(1, { error: "Deve haver ao menos 1 serviço vinculado ao profissional." })
  .transform((ids) => [...new Set(ids)]);

export const createProfessionalSchema = z.object({
  body: z.object({
    name: z
      .string({ error: "O nome é obrigatório" })
      .min(4, { error: "O nome deve conter ao menos 4 caracteres" })
      .max(256, { error: "O nome deve conter no máximo 256 caracteres" })
      .regex(/^[a-zA-Z0-9À-ÿ\s]*$/, {
        error: "O nome não pode conter caracteres especiais",
      }),

    memberId: z.cuid2({ error: "O usuário vinculado é obrigatório" }),

    bio: z
      .string({ error: "A bio é obrigatória" })
      .min(10, { error: "A bio deve conter ao menos 10 caracteres" })
      .max(1800, { error: "A bio está muito longa" }),

    servicesIds: servicesIdsSchema,

    avatar: z.instanceof(File).optional(),
  }),
});

export const backCreateProfessionalSchema = createProfessionalSchema.extend({
  body: createProfessionalSchema.shape.body.extend({
    servicesIds: fromJson(servicesIdsSchema),
  }),
});

export const createProfessionalResponseSchema = z.object({
  professional: professionalSchema.extend({
    user: userSchema.pick({
      email: true,
      phoneNumber: true,
    }),
  }),
  availabilities: z.array(professionalAvailabilitiesSchema),
  services: z.array(serviceSchema.pick({ id: true, name: true })),
});
