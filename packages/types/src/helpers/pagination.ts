import { PaginationMetaSchema } from "@reservo/schemas";

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
