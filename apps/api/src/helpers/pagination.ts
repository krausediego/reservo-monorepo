import z, { ZodType } from "zod";

export const paginationQuerySchema = z.object({
  page: z.coerce
    .number({ error: "A página deve ser um número" })
    .min(1, { error: "Número de página inválido" })
    .int({ error: "A página deve ser um número inteiro" })
    .default(1),
  limit: z.coerce
    .number({ error: "A quantidade por página deve ser um número" })
    .min(1, { error: "Quantidade inválida" })
    .int({ error: "A quantidade por página deve ser um número inteiro" })
    .default(10),
});

export type PaginationQuerySchema = z.infer<typeof paginationQuerySchema>;

export const paginationMetaSchema = z.object({
  total: z.number(),
  page: z.number(),
  limit: z.number(),
  totalPages: z.number(),
  hasNextPage: z.boolean(),
  hasPrevPage: z.boolean(),
});

export type PaginationMetaSchema = z.infer<typeof paginationMetaSchema>;

export const paginatedResponse = <T extends ZodType>(dataSchema: T) =>
  z.object({
    data: z.array(dataSchema),
    meta: paginationMetaSchema,
  });

export type PaginationOffsetParams = {
  page: number;
  limit: number;
};

export type PaginationOffsetResponse = PaginationOffsetParams & {
  offset: number;
};

export const getPaginationOffset = ({
  page = 1,
  limit = 10,
}: PaginationOffsetParams): PaginationOffsetResponse => ({
  offset: (page - 1) * limit,
  limit,
  page,
});

export type BuildPaginationMetaParams = {
  total: number;
  page: number;
  limit: number;
};

export const buildPaginationMeta = ({
  total,
  page = 1,
  limit = 10,
}: BuildPaginationMetaParams): PaginationMetaSchema => {
  const totalPages = limit > 0 ? Math.ceil(total / limit) : 0;

  return {
    total,
    page,
    limit,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
};
