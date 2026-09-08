import type { IListMembersSchema } from "@reservo/types";

export const usersKeys = {
  users: (params: IListMembersSchema.GetParams) =>
    ["users", { ...params }] as const,
};
