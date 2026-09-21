import type { IListMembersSchema } from "@reservo/types";
import { queryOptions } from "@tanstack/react-query";
import { usersKeys } from "./users.keys";
import { listUsersApi } from "./api";

export function listUsersQueryOptions(params: IListMembersSchema.GetParams) {
  return queryOptions({
    queryKey: usersKeys.users(params),
    queryFn: () => listUsersApi(params),
  });
}
