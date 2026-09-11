import type { IListMembersSchema } from "@reservo/types";

export const usersKeys = {
  all: () => ["users"] as const,
  users: (params: IListMembersSchema.GetParams) =>
    [...usersKeys.all(), { ...params }] as const,
};
