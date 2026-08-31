import type { PaginationOffsetParams } from "@reservo/types";

export const usersKeys = {
  users: (params: PaginationOffsetParams) => ["users", { ...params }] as const,
};
