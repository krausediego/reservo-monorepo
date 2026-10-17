import { t } from "elysia";

import { Id } from "@/shared/model";

const capitalize = (value: string) =>
  value.charAt(0).toUpperCase() + value.slice(1);

/**
 * Cada campo tem um `error`: é a mensagem que o `error-handler` devolve
 * quando aquele campo falha (ausente, tipo errado ou fora dos limites).
 */
const name = t
  .Transform(
    t.String({
      minLength: 4,
      maxLength: 256,
      error: "O nome deve conter entre 4 e 256 caracteres",
      examples: ["Corte degradê"],
    }),
  )
  .Decode(capitalize)
  .Encode((value) => value);

const description = t.String({
  minLength: 10,
  maxLength: 400,
  error: "A descrição deve conter entre 10 e 400 caracteres",
});

const durationMinutes = t.Integer({
  minimum: 1,
  maximum: 1440,
  error: "A duração deve ser um número inteiro entre 1 e 1440 minutos",
  description: "Duração em minutos",
});

const priceCents = t.Integer({
  minimum: 1,
  maximum: 1_000_000,
  error: "O preço deve ser um valor inteiro entre 1 e 1.000.000 centavos",
  description: "Preço em centavos",
});

const service = t.Object({
  id: t.String(),
  organizationId: t.String(),
  categoryId: t.String(),
  name: t.String(),
  description: t.String(),
  durationMinutes: t.Integer(),
  priceCents: t.Integer(),
  isActive: t.Boolean(),
  deleted: t.Boolean(),
  createdAt: t.Date(),
  updatedAt: t.Date(),
});

export const ServiceModel = {
  idParams: t.Object({
    id: Id("O ID é obrigatório"),
  }),

  createBody: t.Object({
    name,
    categoryId: Id("A categoria é obrigatória"),
    description,
    professionals: t.Array(Id("O profissional é obrigatório"), {
      minItems: 1,
      error: "Deve haver ao menos 1 profissional habilitado para o serviço",
    }),
    durationMinutes,
    priceCents,
    isActive: t.Optional(
      t.Boolean({ error: "O status do serviço está inválido" }),
    ),
  }),

  updateBody: t.Object({
    name,
    categoryId: Id("A categoria é obrigatória"),
    description,
    durationMinutes,
    priceCents,
    isActive: t.Boolean({ error: "O status é obrigatório" }),
  }),

  serviceResponse: t.Object({ service }),

  overviewResponse: t.Object({
    totalServices: t.Integer(),
    totalActiveServices: t.Integer(),
    totalInactiveServices: t.Integer(),
    avgDuration: t.Integer({ description: "Média em minutos" }),
    avgPrice: t.Integer({ description: "Média em centavos" }),
  }),
};

export type CreateServiceBody = typeof ServiceModel.createBody.static;
export type UpdateServiceBody = typeof ServiceModel.updateBody.static;
